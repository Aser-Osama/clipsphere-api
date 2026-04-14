const Notification = require('../models/Notification');
const emailService = require('./email.service');

const buildNotificationPayload = ({ recipientId, actorId, type, videoId }) => ({
  recipient: recipientId,
  actor: actorId,
  type,
  channel: 'inApp',
  ...(videoId ? { video: videoId } : {})
});

exports.handlePreferenceAwareNotification = async ({
  recipientUser,
  actorId,
  type,
  preferenceKey,
  videoId
}) => {
  const notifications = {
    inApp: []
  };

  if (!recipientUser) {
    return notifications;
  }

  const recipientId = recipientUser._id
    ? recipientUser._id.toString()
    : String(recipientUser);
  const normalizedActorId = actorId.toString();

  if (recipientId === normalizedActorId) {
    return notifications;
  }

  const prefs = recipientUser.notificationPreferences;

  if (prefs?.inApp?.[preferenceKey]) {
    const notification = await Notification.create(
      buildNotificationPayload({
        recipientId,
        actorId: normalizedActorId,
        type,
        videoId
      })
    );

    notifications.inApp.push(notification);
  }

  if (prefs?.email?.[preferenceKey]) {
    emailService.sendEngagementEmail(recipientUser, actorId, type, { videoId });
  }

  return notifications;
};
