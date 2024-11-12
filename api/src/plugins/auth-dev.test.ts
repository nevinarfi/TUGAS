/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Fastify, { FastifyInstance } from 'fastify';

import { defaultUserEmail } from '../../jest.utils';
import { HOME_LOCATION } from '../utils/env';
import { nanoidCharSet } from '../utils/create-user';
import { devAuth } from '../plugins/auth-dev';
import prismaPlugin from '../db/prisma';
import auth from './auth';
import cookies from './cookies';

describe('dev login', () => {
  let fastify: FastifyInstance;

  beforeAll(async () => {
    fastify = Fastify();

    await fastify.register(cookies);
    await fastify.register(auth);
    await fastify.register(devAuth);
    await fastify.register(prismaPlugin);
  });

  beforeEach(async () => {
    await fastify.prisma.user.deleteMany({
      where: { email: defaultUserEmail }
    });
  });

  afterAll(async () => {
    await fastify.prisma.user.deleteMany({
      where: { email: defaultUserEmail }
    });
    await fastify.close();
  });

  describe('GET /signin', () => {
    it('should create an account if one does not exist', async () => {
      const before = await fastify.prisma.user.count({});
      await fastify.inject({
        method: 'GET',
        url: '/signin'
      });

      const after = await fastify.prisma.user.count({});

      expect(before).toBe(0);
      expect(after).toBe(before + 1);
    });

    it('should populate the user with the correct data', async () => {
      const uuidRe = /^[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$/;
      const fccUuidRe = /^fcc-[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$/;
      const unsubscribeIdRe = new RegExp(`^[${nanoidCharSet}]{21}$`);
      const mongodbIdRe = /^[a-f0-9]{24}$/;

      await fastify.inject({
        method: 'GET',
        url: '/signin'
      });

      const user = await fastify.prisma.user.findFirstOrThrow({
        where: { email: defaultUserEmail }
      });

      expect(user).toMatchObject({
        about: '',
        acceptedPrivacyTerms: false,
        completedChallenges: [],
        completedExams: [],
        currentChallengeId: '',
        donationEmails: [],
        email: defaultUserEmail,
        emailAuthLinkTTL: null,
        emailVerified: true,
        emailVerifyTTL: null,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        externalId: expect.stringMatching(uuidRe),
        githubProfile: null,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: expect.stringMatching(mongodbIdRe),
        is2018DataVisCert: false,
        is2018FullStackCert: false,
        isApisMicroservicesCert: false,
        isBackEndCert: false,
        isBanned: false,
        isCheater: false,
        isClassroomAccount: null,
        isDataAnalysisPyCertV7: false,
        isDataVisCert: false,
        isDonating: false,
        isFoundationalCSharpCertV8: false,
        isFrontEndCert: false,
        isFrontEndLibsCert: false,
        isFullStackCert: false,
        isHonest: false,
        isInfosecCertV7: false,
        isInfosecQaCert: false,
        isJsAlgoDataStructCert: false,
        isJsAlgoDataStructCertV8: false,
        isMachineLearningPyCertV7: false,
        isQaCertV7: false,
        isRelationalDatabaseCertV8: false,
        isCollegeAlgebraPyCertV8: false,
        isRespWebDesignCert: false,
        isSciCompPyCertV7: false,
        isUpcomingPythonCertV8: null,
        keyboardShortcuts: false,
        linkedin: null,
        location: '',
        name: '',
        needsModeration: false,
        newEmail: null,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        unsubscribeId: expect.stringMatching(unsubscribeIdRe),
        partiallyCompletedChallenges: [],
        password: null,
        picture: '',
        portfolio: [],
        profileUI: {
          isLocked: false,
          showAbout: false,
          showCerts: false,
          showDonation: false,
          showHeatMap: false,
          showLocation: false,
          showName: false,
          showPoints: false,
          showPortfolio: false,
          showTimeLine: false
        },
        progressTimestamps: [expect.any(Number)],
        savedChallenges: [],
        sendQuincyEmail: false,
        theme: 'default',
        timezone: null,
        twitter: null,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        username: expect.stringMatching(fccUuidRe),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        usernameDisplay: expect.stringMatching(fccUuidRe),
        verificationToken: null,
        website: null,
        yearsTopContributor: []
      });
      expect(user.username).toBe(user.usernameDisplay);
    });

    it('should set the jwt_access_token cookie', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/signin'
      });

      expect(res.statusCode).toBe(302);

      expect(res.cookies).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'jwt_access_token' })
        ])
      );
    });

    it.todo('should create a session');

    it('should redirect to the Referer (if it is a valid origin)', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/signin',
        headers: {
          referer: 'https://www.freecodecamp.org/some-path/or/other'
        }
      });

      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe(
        'https://www.freecodecamp.org/some-path/or/other'
      );
    });

    it('should redirect to /valid-language/learn when signing in from /valid-language', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/signin',
        headers: {
          referer: 'https://www.freecodecamp.org/espanol'
        }
      });

      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe(
        'https://www.freecodecamp.org/espanol/learn'
      );
    });

    it('should handle referers with trailing slahes', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/signin',
        headers: {
          referer: 'https://www.freecodecamp.org/espanol/'
        }
      });

      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe(
        'https://www.freecodecamp.org/espanol/learn'
      );
    });

    it('should redirect to /learn by default', async () => {
      const res = await fastify.inject({
        method: 'GET',
        url: '/signin'
      });

      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe(`${HOME_LOCATION}/learn`);
    });
  });
});
