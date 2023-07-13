import { setupServer, superRequest } from '../../jest.utils';

const isValidChallengeCompletionErrorMsg = {
  type: 'error',
  message: 'That does not appear to be a valid challenge submission.'
};

const backendChallengeId1 = '587d7fb1367417b2b2512bf4';
const backendChallengeId2 = '587d7fb2367417b2b2512bf8';

const backendChallengeBody1 = {
  id: backendChallengeId1,
  solution: 'https://any.valid/url'
};
const backendChallengeBody2 = {
  id: backendChallengeId2,
  solution: 'https://other.valid/url'
};

describe('challengeRoutes', () => {
  setupServer();

  describe('Authenticated user', () => {
    let setCookies: string[];

    // Authenticate user
    beforeAll(async () => {
      const res = await superRequest('/auth/dev-callback', { method: 'GET' });
      expect(res.status).toBe(200);
      setCookies = res.get('Set-Cookie');
    });

    describe('/backend-challenge-completed', () => {
      describe('validation', () => {
        test('POST rejects requests without ids', async () => {
          const response = await superRequest('/backend-challenge-completed', {
            method: 'POST',
            setCookies
          });

          expect(response.statusCode).toBe(400);
          expect(response.body).toStrictEqual(
            isValidChallengeCompletionErrorMsg
          );
        });

        test('POST rejects requests without valid ObjectIDs', async () => {
          const response = await superRequest('/backend-challenge-completed', {
            method: 'POST',
            setCookies
          }).send({ id: 'not-a-valid-id', solution: '' });

          expect(response.statusCode).toBe(400);
          expect(response.body).toStrictEqual(
            isValidChallengeCompletionErrorMsg
          );
        });

        test('POST rejects requests without solutions', async () => {
          const response = await superRequest('/backend-challenge-completed', {
            method: 'POST',
            setCookies
          }).send({ id: backendChallengeId1 });

          expect(response.statusCode).toBe(400);
          expect(response.body).toStrictEqual({
            type: 'error',
            message:
              'You have not provided the valid links for us to inspect your work.'
          });
        });

        test('POST rejects requests with invalid solution link', async () => {
          const response = await superRequest('/backend-challenge-completed', {
            method: 'POST',
            setCookies
          }).send({
            id: backendChallengeId1,
            solution: 'not-a-valid-solution'
          });

          expect(response.statusCode).toBe(400);
          expect(response.body).toStrictEqual(
            isValidChallengeCompletionErrorMsg
          );
        });
      });

      describe('handling', () => {
        beforeEach(async () => {
          await fastifyTestInstance.prisma.user.updateMany({
            where: { email: 'foo@bar.com' },
            data: {
              partiallyCompletedChallenges: [],
              completedChallenges: [],
              savedChallenges: [],
              progressTimestamps: []
            }
          });
        });

        test('POST accepts backend challenges', async () => {
          const now = Date.now();

          const response = await superRequest('/backend-challenge-completed', {
            method: 'POST',
            setCookies
          }).send(backendChallengeBody1);

          const user = await fastifyTestInstance.prisma.user.findFirst({
            where: { email: 'foo@bar.com' }
          });

          expect(user).toMatchObject({
            completedChallenges: [
              {
                ...backendChallengeBody1,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                completedDate: expect.any(Number)
              }
            ]
          });

          const completedDate = user?.completedChallenges[0]?.completedDate;
          expect(completedDate).toBeGreaterThanOrEqual(now);
          expect(completedDate).toBeLessThanOrEqual(now + 1000);

          expect(response.statusCode).toBe(200);
          expect(response.body).toStrictEqual({
            alreadyCompleted: false,
            points: 1,
            completedDate
          });
        });

        test('POST correctly handles multiple requests', async () => {
          const resOne = await superRequest('/backend-challenge-completed', {
            method: 'POST',
            setCookies
          }).send(backendChallengeBody1);

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const originalCompletedDate = resOne.body.completedDate;

          await superRequest('/backend-challenge-completed', {
            method: 'POST',
            setCookies
          }).send(backendChallengeBody2);

          const resTwo = await superRequest('/backend-challenge-completed', {
            method: 'POST',
            setCookies
          }).send({
            ...backendChallengeBody1,
            solution: 'https://any.other/url'
          });

          const user = await fastifyTestInstance.prisma.user.findFirst({
            where: { email: 'foo@bar.com' }
          });

          const expectedProgressTimestamps = user?.completedChallenges.map(
            challenge => challenge.completedDate
          );

          expect(user).toMatchObject({
            completedChallenges: [
              {
                ...backendChallengeBody1,
                solution: 'https://any.other/url',
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                completedDate: expect.any(Number)
              },
              {
                ...backendChallengeBody2,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                completedDate: expect.any(Number)
              }
            ],
            progressTimestamps: expectedProgressTimestamps
          });

          const completedDate = user?.completedChallenges[0]?.completedDate;

          expect(completedDate).toBe(originalCompletedDate);

          expect(resTwo.statusCode).toBe(200);
          expect(resTwo.body).toStrictEqual({
            alreadyCompleted: true,
            points: 2,
            completedDate
          });
        });
      });
    });
  });

  describe('Unauthenticated user', () => {
    let setCookies: string[];

    // Get the CSRF cookies from an unprotected route
    beforeAll(async () => {
      const res = await superRequest('/', { method: 'GET' });
      setCookies = res.get('Set-Cookie');
    });

    test('POST /backend-challenge-completed returns 401 status code for un-authenticated-user', async () => {
      const response = await superRequest('/backend-challenge-completed', {
        method: 'POST',
        setCookies
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
