/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const html = 0;
const js = 1;
export const backend = 2;
const zipline = 3;
export const frontEndProject = 3;
export const backEndProject = 4;
const bonfire = 5;
const modern = 6;
const step = 7;
const quiz = 8;
const invalid = 9;
export const pythonProject = 10;
const video = 11;
const codeally = 12;

export const challengeTypes = {
  html,
  js,
  backend,
  zipline,
  frontEndProject,
  backEndProject,
  pythonProject,
  bonfire,
  modern,
  step,
  quiz,
  invalid,
  video,
  codeally
};

// turn challengeType to file ext
export const pathsMap = {
  [html]: 'html',
  [js]: 'js',
  [bonfire]: 'js'
};
// determine the component to view for each challenge
export const viewTypes = {
  [html]: 'classic',
  [js]: 'classic',
  [bonfire]: 'classic',
  [frontEndProject]: 'frontend',
  [backEndProject]: 'backend',
  [pythonProject]: 'frontend',
  [modern]: 'modern',
  [step]: 'step',
  [quiz]: 'quiz',
  [backend]: 'backend',
  [video]: 'video',
  [codeally]: 'codeally'
};

// determine the type of submit function to use for the challenge on completion
export const submitTypes = {
  [html]: 'tests',
  [js]: 'tests',
  [bonfire]: 'tests',
  // requires just a single url
  // like codepen.com/my-project
  [frontEndProject]: 'project.frontEnd',
  // requires two urls
  // a hosted URL where the app is running live
  // project code url like GitHub
  [backEndProject]: 'project.backEnd',
  [pythonProject]: 'project.backEnd',
  [step]: 'step',
  [quiz]: 'quiz',
  [backend]: 'backend',
  [modern]: 'tests',
  [video]: 'tests'
};

// determine which help forum questions should be posted to
exports.helpCategoryMap = require('./help-category-map.json');
