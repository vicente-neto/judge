const Googleapi = require("./src/infra/google-api");

const service = Googleapi.getdriveactivity();
const params = {
  "itemName":"items/1ccO8Rt3JF6flIuJ7Ar5ks9KjAJXVBlwr"
};
service.activity.query({requestBody: params}, (err, res) => {
  if (err) return console.error('The API returned an error: ' + err);
  const activities = res.data.activities;
  if (activities) {
    console.log('Recent activity:');
    activities.filter((activity)=>activity.primaryActionDetail.hasOwnProperty("restore")).forEach((activity) => {
      console.log(activity);
     
    });
  } else {
    console.log('No activity.');
  }
});


function getTimeInfo(activity) {
  if ('timestamp' in activity) {
    return activity.timestamp;
  }
  if ('timeRange' in activity) {
    return activity.timeRange.endTime;
  }
  return 'unknown';
}

/**
 * Returns the type of action.
 *
 * @param {Object} actionDetail The ActionDetail to summarize.
 * @return {string}
 */
function getActionInfo(actionDetail) {
  return getOneOf(actionDetail);
}

/**
 * Returns user information, or the type of user if not a known user.
 *
 * @param {Object} user The User to summarize.
 * @return {string}
 */
function getUserInfo(user) {
  if ('knownUser' in user) {
    const knownUser = user.knownUser;
    const isMe = knownUser.isCurrentUser || false;
    return isMe ? 'people/me' : knownUser.personName;
  }
  return getOneOf(user);
}

/**
 * Returns actor information, or the type of actor if not a user.
 *
 * @param {Object} actor The Actor to summarize.
 * @return {string}
 */
function getActorInfo(actor) {
  if ('user' in actor) {
    return getUserInfo(actor.user);
  }
  return getOneOf(actor);
}

/**
 * Returns the type of a target and an associated title.
 *
 * @param {Object} target The Target to summarize.
 * @return {string}
 */
function getTargetInfo(target) {
  if ('driveItem' in target) {
    const title = target.driveItem.title || 'unknown';
    return `driveItem:"${title}"`;
  }
  if ('drive' in target) {
    const title = target.drive.title || 'unknown';
    return `drive:"${title}"`;
  }
  if ('fileComment' in target) {
    const parent = target.fileComment.parent || {};
    const title = parent.title || 'unknown';
    return `fileComment:"${title}"`;
  }
  return `${getOneOf(target)}:unknown`;
}

/**
 * Returns a string representation of the first elements in a list.
 *
 * @param {Array<Object>} array The array to convert to a short string.
 * @param {number} limit The number of elements to show before truncating.
 * @return {string}
 */
function truncated(array, limit = 2) {
  const contents = array.slice(0, limit).join(', ');
  const more = array.length > limit ? ', ...' : '';
  return `[${contents}${more}]`;
}

/**
 * Returns the name of a set property in an object, or else "unknown".
 *
 * @param {Object} object The object in which to find the set property.
 * @return {string}
 */
function getOneOf(object) {
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      return key;
    }
  }
  return 'unknown';
}
