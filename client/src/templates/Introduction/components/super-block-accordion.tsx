import React, { ReactNode, useMemo } from 'react';
import { uniqBy } from 'lodash-es';
import { useTranslation } from 'react-i18next';
// TODO: Add this component to freecodecamp/ui and remove this dependency
import { Disclosure } from '@headlessui/react';

import { ChallengeNode } from '../../../redux/prop-types';
import { SuperBlocks } from '../../../../../shared/config/curriculum';
import DropDown from '../../../assets/icons/dropdown';
// TODO: See if there's a nice way to incorporate the structure into data Gatsby
// sources from the curriculum, rather than importing it directly.
import superBlockStructure from '../../../../../curriculum/superblock-structure/full-stack.json';
import Block from './block';

import './super-block-accordion.css';

interface ChapterProps {
  dashedName: string;
  children: ReactNode;
  isExpanded: boolean;
}

interface ModuleProps {
  dashedName: string;
  children: ReactNode;
  isExpanded: boolean;
}
interface SuperBlockTreeViewProps {
  challenges: ChallengeNode['challenge'][];
  superBlock: SuperBlocks;
  chosenBlock: string;
}

const modules = superBlockStructure.chapters.flatMap(({ modules }) => modules);
const chapters = superBlockStructure.chapters;

const isLinkModule = (name: string) => {
  const module = modules.find(module => module.dashedName === name);

  return module?.moduleType === 'review';
};

const isLinkChapter = (name: string) => {
  const chapter = chapters.find(chapter => chapter.dashedName === name);

  return chapter?.chapterType === 'exam';
};

const getBlockToChapterMap = () => {
  const blockToChapterMap = new Map<string, string>();
  chapters.forEach(chapter => {
    chapter.modules.forEach(module => {
      module.blocks.forEach(block => {
        blockToChapterMap.set(block.dashedName, chapter.dashedName);
      });
    });
  });

  return blockToChapterMap;
};

const getBlockToModuleMap = () => {
  const blockToModuleMap = new Map<string, string>();
  modules.forEach(module => {
    module.blocks.forEach(block => {
      blockToModuleMap.set(block.dashedName, module.dashedName);
    });
  });

  return blockToModuleMap;
};

const blockToChapterMap = getBlockToChapterMap();
const blockToModuleMap = getBlockToModuleMap();

const Chapter = ({ dashedName, children, isExpanded }: ChapterProps) => {
  const { t } = useTranslation();

  return (
    <Disclosure as='li' className='chapter' defaultOpen={isExpanded}>
      <Disclosure.Button className='chapter-button'>
        {t(`intro:full-stack-developer.chapters.${dashedName}`)}
        <DropDown />
      </Disclosure.Button>
      <Disclosure.Panel as='ul' className='chapter-panel'>
        {children}
      </Disclosure.Panel>
    </Disclosure>
  );
};

const Module = ({ dashedName, children, isExpanded }: ModuleProps) => {
  const { t } = useTranslation();

  return (
    <Disclosure as='li' defaultOpen={isExpanded}>
      <Disclosure.Button className='module-button'>
        <DropDown />
        {t(`intro:full-stack-developer.modules.${dashedName}`)}
      </Disclosure.Button>
      <Disclosure.Panel as='ul' className='module-panel'>
        {children}
      </Disclosure.Panel>
    </Disclosure>
  );
};

export const SuperBlockAccordion = ({
  challenges,
  superBlock,
  chosenBlock
}: SuperBlockTreeViewProps) => {
  const { currentChapters } = useMemo(() => {
    const currentBlocks = uniqBy(challenges, 'block').map(
      ({ block, blockType, chapter, module }) => ({
        name: block,
        blockType,
        chapter: chapter as string,
        module: module as string,
        challenges: challenges.filter(({ block: b }) => b === block)
      })
    );

    const currentModules = uniqBy(currentBlocks, 'module').map(
      ({ module, chapter }) => ({
        name: module,
        chapter,
        blocks: currentBlocks.filter(({ module: m }) => m === module)
      })
    );

    const currentChapters = uniqBy(currentModules, 'chapter').map(
      ({ chapter }) => ({
        name: chapter,
        modules: currentModules.filter(({ chapter: c }) => c === chapter)
      })
    );

    return { currentChapters };
  }, [challenges]);

  // Expand the outer layers in order to reveal the chosen block.
  const expandedChapter = blockToChapterMap.get(chosenBlock);
  const expandedModule = blockToModuleMap.get(chosenBlock);

  return (
    <ul className='super-block-accordion'>
      {currentChapters.map(chapter => {
        if (isLinkChapter(chapter.name)) {
          const linkedChallenge = chapter.modules[0].blocks[0].challenges[0];
          return (
            <li key={chapter.name} className='link-chapter'>
              <Block
                block={linkedChallenge.block}
                blockType={linkedChallenge.blockType}
                challenges={[linkedChallenge]}
                superBlock={superBlock}
              />
            </li>
          );
        }

        return (
          <Chapter
            key={chapter.name}
            dashedName={chapter.name}
            isExpanded={expandedChapter === chapter.name}
          >
            {chapter.modules.map(module => {
              if (isLinkModule(module.name)) {
                const linkedChallenge = module.blocks[0].challenges[0];
                return (
                  <li key={module.name} className='link-module'>
                    <Block
                      block={linkedChallenge.block}
                      blockType={linkedChallenge.blockType}
                      challenges={[linkedChallenge]}
                      superBlock={superBlock}
                    />
                  </li>
                );
              }

              return (
                <Module
                  key={module.name}
                  dashedName={module.name}
                  isExpanded={expandedModule === module.name}
                >
                  {module.blocks.map(block => (
                    <li key={block.name}>
                      <Block
                        block={block.name}
                        blockType={block.blockType}
                        challenges={block.challenges}
                        superBlock={superBlock}
                      />
                    </li>
                  ))}
                </Module>
              );
            })}
          </Chapter>
        );
      })}
    </ul>
  );
};
