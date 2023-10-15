/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import fs from 'fs';
import { join } from 'path';
import ObjectID from 'bson-objectid';
import glob from 'glob';
import matter from 'gray-matter';

// NOTE:
// Use `console.log()` before mocking the filesystem or use
// `process.stdout.write()` instead. There are issues when using `mock-fs` and
// `require`.

jest.mock('bson-objectid', () => {
  return jest.fn(() => ({ toString: () => mockChallengeId }));
});

jest.mock('./helpers/get-step-template', () => {
  return {
    getStepTemplate: jest.fn(() => 'Mock template...')
  };
});

const mockChallengeId = '60d35cf3fe32df2ce8e31b03';
import { getStepTemplate } from './helpers/get-step-template';
import {
  createChallengeFile,
  createStepFile,
  insertStepIntoMeta,
  updateStepTitles
} from './utils';

const metaPath = join(
  process.cwd(),
  'curriculum',
  'challenges',
  '_meta',
  'project'
);
const superBlockPath = join(
  process.cwd(),
  'curriculum',
  'challenges',
  'english',
  'superblock'
);
const projectPath = join(superBlockPath, 'project');

describe('Challenge utils helper scripts', () => {
  describe('createStepFile util', () => {
    it('should create next step and return its identifier', () => {
      fs.mkdirSync(superBlockPath);
      fs.mkdirSync(projectPath);
      fs.writeFileSync(
        join(projectPath, 'step-001.md'),
        'Lorem ipsum...',
        'utf-8'
      );
      fs.writeFileSync(
        join(projectPath, 'step-002.md'),
        'Lorem ipsum...',
        'utf-8'
      );
      process.env.CALLING_DIR = projectPath;
      const step = createStepFile({
        stepNum: 3
      });

      expect(step.toString()).toEqual(mockChallengeId);
      expect(ObjectID).toHaveBeenCalledTimes(1);

      // Internal tasks
      // - Should generate a template for the step that is being created
      expect(getStepTemplate).toHaveBeenCalledTimes(1);

      // - Should write a file with a given name and template
      const files = glob.sync(`${projectPath}/*.md`);

      expect(files).toEqual([
        `${projectPath}/${mockChallengeId}.md`,
        `${projectPath}/step-001.md`,
        `${projectPath}/step-002.md`
      ]);
    });
  });

  describe('createChallengeFile util', () => {
    it('should create the challenge', () => {
      fs.mkdirSync(superBlockPath);
      fs.mkdirSync(projectPath);
      fs.writeFileSync(
        join(projectPath, 'fake-challenge.md'),
        'Lorem ipsum...',
        'utf-8'
      );
      fs.writeFileSync(
        join(projectPath, 'so-many-fakes.md'),
        'Lorem ipsum...',
        'utf-8'
      );

      process.env.CALLING_DIR = projectPath;

      createChallengeFile('hi', 'pretend this is a template');
      // - Should write a file with a given name and template
      const files = glob.sync(`${projectPath}/*.md`);

      expect(files).toEqual([
        `${projectPath}/fake-challenge.md`,
        `${projectPath}/hi.md`,
        `${projectPath}/so-many-fakes.md`
      ]);
    });
  });

  describe('insertStepIntoMeta util', () => {
    it('should update the meta with a new file id and name', () => {
      fs.mkdirSync(metaPath);
      fs.writeFileSync(
        join(metaPath, 'meta.json'),
        `{"id": "mock-id",
        "challengeOrder": [
          {
            "id": "id-1",
            "title": "Step 1"
          },
          {
            "id": "id-2",
            "title": "Step 2"
          },
          {
            "id": "id-3",
            "title": "Step 3"
          }
        ]}`,
        'utf-8'
      );
      process.env.CALLING_DIR = projectPath;

      insertStepIntoMeta({ stepNum: 3, stepId: new ObjectID(mockChallengeId) });

      const meta = JSON.parse(
        fs.readFileSync(join(metaPath, 'meta.json')).toString('utf-8')
      );
      expect(meta).toEqual({
        id: 'mock-id',
        challengeOrder: [
          {
            id: 'id-1',
            title: 'Step 1'
          },
          {
            id: 'id-2',
            title: 'Step 2'
          },
          {
            id: mockChallengeId,
            title: 'Step 3'
          },
          {
            id: 'id-3',
            title: 'Step 4'
          }
        ]
      });
    });
  });

  describe('updateStepTitles util', () => {
    it('should apply meta.challengeOrder to step files', () => {
      fs.mkdirSync(metaPath);
      fs.writeFileSync(
        join(metaPath, 'meta.json'),
        `{"id": "mock-id", "challengeOrder": [{"id": "id-1", "title": "Step 1"}, {"id": "id-3", "title": "Step 2"}, {"id": "id-2", "title": "Step 3"}]}`,
        'utf-8'
      );
      fs.mkdirSync(superBlockPath);
      fs.mkdirSync(projectPath);
      fs.writeFileSync(
        join(projectPath, 'id-1.md'),
        `---
id: id-1
title: Step 2
challengeType: a
dashedName: step-2
---
`,
        'utf-8'
      );
      fs.writeFileSync(
        join(projectPath, 'id-2.md'),
        `---
id: id-2
title: Step 1
challengeType: b
dashedName: step-1
---
`,
        'utf-8'
      );
      fs.writeFileSync(
        join(projectPath, 'id-3.md'),
        `---
id: id-3
title: Step 3
challengeType: c
dashedName: step-3
---
`,
        'utf-8'
      );

      process.env.CALLING_DIR = projectPath;

      updateStepTitles();

      const expected1 = fs
        .readFileSync(join(projectPath, 'id-1.md'))
        .toString('utf-8');
      const expected2 = fs
        .readFileSync(join(projectPath, 'id-2.md'))
        .toString('utf-8');
      const expected3 = fs
        .readFileSync(join(projectPath, 'id-3.md'))
        .toString('utf-8');
      expect(matter(expected1).data).toEqual({
        id: 'id-1',
        title: 'Step 1',
        challengeType: 'a',
        dashedName: 'step-1'
      });
      expect(matter(expected2).data).toEqual({
        id: 'id-2',
        title: 'Step 3',
        challengeType: 'b',
        dashedName: 'step-3'
      });
      expect(matter(expected3).data).toEqual({
        id: 'id-3',
        title: 'Step 2',
        challengeType: 'c',
        dashedName: 'step-2'
      });
    });
  });
  afterEach(() => {
    delete process.env.CALLING_DIR;
    try {
      fs.rmSync(superBlockPath, { recursive: true });
    } catch (err) {
      console.log('Could not remove superblock mock folder. ');
    }
    try {
      fs.rmSync(metaPath, { recursive: true });
    } catch (err) {
      console.log('Could not remove meta mock folder.');
    }
  });
});
