/**
 * Notification Service for Frontend-Components-Notifications v6
 * ==============================================================
 * 
 * This service creates a global notification store that can be used both
 * in React components (via hooks) and in utility functions (directly).
 * 
 * Usage in React components:
 * - Import and use useAddNotification() hook as normal
 * 
 * Usage in utility functions:
 * - Import { addNotification, removeNotification } from this file
 * - Call directly: addNotification({ title: '...', variant: 'success' })
 */

import { createStore, NotificationsStore } from '@redhat-cloud-services/frontend-components-notifications';

// Global notification store instance
export const notificationStore: NotificationsStore = createStore();

// Export functions for use in non-React contexts
export const addNotification = notificationStore.addNotification;
export const removeNotification = notificationStore.removeNotification;
export const clearNotifications = notificationStore.clearNotifications;

// Export store for provider
export default notificationStore;