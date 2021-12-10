import { find, first } from 'lodash-es';
import React, { useState } from 'react';
import '../components/layouts/project-links.css';
import { Trans, useTranslation } from 'react-i18next';
import ProjectModal from '../components/SolutionViewer/ProjectModal';
import { Spacer, Link } from '../components/helpers';
import { ChallengeFiles, CompletedChallenge, User } from '../redux/prop-types';
import {
  projectMap,
  legacyProjectMap
} from '../resources/cert-and-project-map';

import { maybeUrlRE } from '../utils';

interface ShowProjectLinksProps {
  certName: string;
  name: string;
  user: User;
}

type SolutionState = {
  projectTitle: string;
  challengeFiles: ChallengeFiles;
  solution: CompletedChallenge['solution'];
  isOpen: boolean;
};

const initSolutionState: SolutionState = {
  projectTitle: '',
  challengeFiles: null,
  solution: '',
  isOpen: false
};

const ShowProjectLinks = (props: ShowProjectLinksProps): JSX.Element => {
  const [solutionState, setSolutionState] = useState(initSolutionState);

  const handleSolutionModalHide = () => setSolutionState(initSolutionState);

  const { t } = useTranslation();

  const getProjectSolution = (projectId: string, projectTitle: string) => {
    const {
      user: { completedChallenges }
    } = props;
    const completedProject = find(
      completedChallenges,
      ({ challengeId }) => projectId === challengeId
    ) as CompletedChallenge;

    if (!completedProject) {
      return null;
    }

    const { solution, githubLink, challengeFiles } = completedProject;
    const onClickHandler = () =>
      setSolutionState({
        projectTitle,
        challengeFiles,
        solution,
        isOpen: true
      });

    if (challengeFiles?.length) {
      return (
        <button
          className='project-link-button-override'
          data-cy={`${projectTitle} solution`}
          onClick={onClickHandler}
        >
          {t('certification.project.solution')}
        </button>
      );
    }
    if (githubLink) {
      return (
        <>
          <a href={solution ?? ''} rel='noopener noreferrer' target='_blank'>
            {t('certification.project.solution')}
          </a>
          ,{' '}
          <a href={githubLink} rel='noopener noreferrer' target='_blank'>
            {t('certification.project.source')}
          </a>
        </>
      );
    }
    if (maybeUrlRE.test(solution ?? '')) {
      return (
        <a
          className='btn-invert'
          href={solution ?? ''}
          rel='noopener noreferrer'
          target='_blank'
        >
          {t('certification.project.solution')}
        </a>
      );
    }
    return (
      <button className='project-link-button-override' onClick={onClickHandler}>
        {t('certification.project.solution')}
      </button>
    );
  };

  const renderProjectsFor = (certName: string) => {
    if (certName === 'Legacy Full Stack') {
      const legacyCerts = [
        { title: 'Responsive Web Design' },
        { title: 'JavaScript Algorithms and Data Structures' },
        { title: 'Front End Development Libraries' },
        { title: 'Data Visualization' },
        { title: 'Back End Development and APIs' },
        { title: 'Legacy Information Security and Quality Assurance' }
      ] as const;
      return legacyCerts.map((cert, ind) => {
        const mapToUse = (projectMap[cert.title] ||
          legacyProjectMap[cert.title]) as { certSlug: string }[];
        const { certSlug } = first(mapToUse) as { certSlug: string };
        const certLocation = `/certification/${username}/${certSlug}`;
        return (
          <li key={ind}>
            <a
              className='btn-invert project-link'
              href={certLocation}
              rel='noopener noreferrer'
              target='_blank'
            >
              {t(`certification.project.title.${cert.title}`, cert.title)}
            </a>
          </li>
        );
      });
    }
    // @ts-expect-error Error expected until projectMap is typed
    const project = (projectMap[certName] || legacyProjectMap[certName]) as {
      link: string;
      title: string;
      challengeId: string;
    }[];
    return project.map(({ link, title, challengeId }) => (
      <li key={challengeId}>
        <Link className='project-link' to={link}>
          {t(`certification.project.title.${title}`, title)}
        </Link>
        : {getProjectSolution(challengeId, title)}
      </li>
    ));
  };

  const {
    certName,
    name,
    user: { username }
  } = props;
  const { challengeFiles, isOpen, projectTitle, solution } = solutionState;
  return (
    <div>
      {t(
        certName === 'Legacy Full Stack'
          ? 'certification.project.heading-legacy-full-stack'
          : 'certification.project.heading',
        { user: name }
      )}
      <Spacer />
      <ul>{renderProjectsFor(certName)}</ul>
      <Spacer />
      {isOpen ? (
        <ProjectModal
          challengeFiles={challengeFiles}
          handleSolutionModalHide={handleSolutionModalHide}
          isOpen={isOpen}
          projectTitle={projectTitle}
          // 'solution' is theoretically never 'null', if it a JsAlgoData cert
          // which is the only time we use the modal
          solution={solution as undefined | string}
        />
      ) : null}
      <Trans i18nKey='certification.project.footnote'>
        If you suspect that any of these projects violate the{' '}
        <a
          href='https://www.freecodecamp.org/news/academic-honesty-policy/'
          rel='noreferrer'
          target='_blank'
        >
          academic honesty policy
        </a>
        , please{' '}
        <a
          href={`/user/${username}/report-user`}
          rel='noreferrer'
          target='_blank'
        >
          report this to our team
        </a>
        .
      </Trans>
    </div>
  );
};

ShowProjectLinks.displayName = 'ShowProjectLinks';

export default ShowProjectLinks;
