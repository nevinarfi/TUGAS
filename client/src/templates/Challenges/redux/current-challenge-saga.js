import { put, select, call, takeEvery } from 'redux-saga/effects';
import store from 'store';

import {
  isSignedInSelector,
  currentChallengeIdSelector,
  openDonationModal,
  showDonationSelector,
  updateCurrentChallengeUrl,
  updateComplete,
  updateFailed,
  userSelector
} from '../../../redux';

import { post } from '../../../utils/ajax';

import { randomCompliment } from '../utils/get-words';
import { updateSuccessMessage } from './';

export const CURRENT_CHALLENGE_KEY = 'currentChallengeUrl';

export function* currentChallengeSaga({ payload: { id, slug } }) {
  store.set(CURRENT_CHALLENGE_KEY, slug);
  yield put(updateCurrentChallengeUrl(slug));

  const isSignedIn = yield select(isSignedInSelector);
  const currentChallengeId = yield select(currentChallengeIdSelector);
  // TODO: should the server update take place on challenge completion instead?
  if (isSignedIn && id !== currentChallengeId) {
    const update = {
      endpoint: '/update-my-current-challenge',
      payload: {
        currentChallengeId: id
      }
    };
    try {
      yield call(post, update.endpoint, update.payload);
      yield put(updateComplete());
    } catch {
      yield put(updateFailed(update));
    }
  }
}

function* updateSuccessMessageSaga() {
  yield put(updateSuccessMessage(randomCompliment()));
}

function* showDonateModalSaga() {
  let { isDonating } = yield select(userSelector);
  let shouldShowDonate = yield select(showDonationSelector);
  if (!isDonating && shouldShowDonate) {
    yield put(openDonationModal());
  }
}

export function createCurrentChallengeSaga(types) {
  return [
    takeEvery(types.challengeMounted, currentChallengeSaga),
    takeEvery(types.challengeMounted, updateSuccessMessageSaga),
    takeEvery(types.challengeMounted, showDonateModalSaga)
  ];
}
