/**
 * Provides utilities for move xblock.
 */
define(['jquery', 'underscore', 'common/js/components/views/feedback_alert', 'js/views/utils/xblock_utils',
        'js/views/utils/move_xblock_utils', 'edx-ui-toolkit/js/utils/string-utils'],
    function($, _, AlertView, XBlockViewUtils, MoveXBlockUtils, StringUtils) {
        'use strict';
        var undoMoveXBlock, showMovedNotification, hideMovedNotification;

        undoMoveXBlock = function(data) {
            XBlockViewUtils.moveXBlock(data.sourceLocator, data.sourceParentLocator, data.targetIndex)
            .done(function(response) {
                // show XBlock element
                $('.studio-xblock-wrapper[data-locator="' + response.move_source_locator + '"]').show();
                showMovedNotification(
                    StringUtils.interpolate(
                        gettext('Move cancelled. "{sourceDisplayName}" has been moved back to its original ' +
                            'location.'),
                        {
                            sourceDisplayName: data.sourceDisplayName
                        }
                    )
                );
            });
        };

        showMovedNotification = function(title, data) {
            var movedAlertView;
            if (data) {
                movedAlertView = new AlertView.Confirmation({
                    title: title,
                    actions: {
                        primary: {
                            text: gettext('Undo move'),
                            class: 'action-save',
                            data: JSON.stringify({
                                sourceDisplayName: data.sourceDisplayName,
                                sourceLocator: data.sourceLocator,
                                sourceParentLocator: data.sourceParentLocator,
                                targetIndex: data.targetIndex
                            }),
                            click: function(view) {
                                undoMoveXBlock(view.$el.find('.action-primary').data('primary'));
                            }
                        },
                        secondary: [
                            {
                                text: gettext('Take me to the new location'),
                                class: 'action-cancel',
                                data: JSON.stringify({
                                    targetParentLocator: data.targetParentLocator
                                }),
                                click: function(view) {
                                    window.location.href = '/container/' +
                                        view.$el.find('.action-secondary').data('secondary').targetParentLocator;
                                }
                            }
                        ]
                    }
                });
            } else {
                movedAlertView = new AlertView.Confirmation({
                    title: title
                });
            }
            movedAlertView.show();
            // scroll to top
            $.smoothScroll({
                offset: 0,
                easing: 'swing',
                speed: 1000
            });
            movedAlertView.$('.wrapper').first().focus();
            return movedAlertView;
        };

        hideMovedNotification = function(SystemFeedback) {
            var movedAlertView = SystemFeedback.active_alert;
            if (movedAlertView) {
                AlertView.prototype.hide.apply(movedAlertView);
            }
        };

        return {
            showMovedNotification: showMovedNotification,
            hideMovedNotification: hideMovedNotification
        };
    });
