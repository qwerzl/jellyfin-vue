import { Context } from '@nuxt/types';
import {
  authStore,
  clientSettingsStore,
  deviceProfileStore,
  homeSectionStore,
  pageStore,
  snackbarStore,
  socketStore,
  userViewsStore
} from '~/store';
import { authLogic } from '~/middleware/auth';

/**
 * Authentication logic on app runtime
 *
 * The logic to handle logouts and user switches during initialization lives inside Nuxt's auth plugin (~/plugins/nuxt/auth)
 */
export default function watchAuth(ctx: Context) {
  const auth = authStore();
  const deviceProfile = deviceProfileStore();
  const clientSettings = clientSettingsStore();
  const homeSection = homeSectionStore();
  const snackbar = snackbarStore();
  const page = pageStore();
  const socket = socketStore();
  const userViews = userViewsStore();

  /**
   * Watch for actions after the app has been initialized
   */
  auth.$onAction(({ name, after, store }) => {
    after(() => {
      if (name !== 'setAxiosHeader') {
        authLogic(ctx, auth, false);

        if (name === 'logoutUser' && store.currentUserIndex === -1) {
          deviceProfile.$reset();
          clientSettings.$reset();
          homeSection.$reset();
          snackbar.$reset();
          page.$reset();
          socket.closeSocket();
          userViews.$reset();
        }
      }
    });
  });
}
