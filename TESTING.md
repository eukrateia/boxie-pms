# PMS Testing Checklist

Test URL: https://boxie.helicoyd.com/pms/

## Authentication & Data Persistence

- [ ] Sign up, logout, login with same account
- [ ] Refresh page mid-session—should stay logged in
- [ ] Open app in 2 browser tabs—verify data syncs
- [ ] Try login with invalid email format
- [ ] Try signup with existing email—should error
- [ ] Login with wrong password (error message)
- [ ] Logout and verify redirect to login

## Projects Edge Cases

- [ ] Create project (name + description)
- [ ] Create project with special characters (emoji, quotes)
- [ ] View all projects
- [ ] Edit project (name, description, status, color)
- [ ] Edit project name to empty string—should error
- [ ] Delete project (with confirmation)
- [ ] Delete project with tasks—what happens?
- [ ] Rename project, refresh—verify persists
- [ ] Verify project appears/disappears in list immediately

## Tasks Edge Cases

- [ ] Create task with empty description—should allow
- [ ] Create task, set past due date—mark overdue immediately
- [ ] Edit task to past due date—should update UI
- [ ] Create task without due date—should not break UI
- [ ] View tasks by status (to-do, in-progress, in-review, done)
- [ ] Edit task details
- [ ] Change task status
- [ ] Delete task, refresh—should stay deleted
- [ ] Edit task while another window deletes it
- [ ] Delete task (with confirmation)
- [ ] Edit task priority
- [ ] Edit task due date and save

## Comments

- [ ] Add comment to a task
- [ ] Add comment, refresh—should persist
- [ ] Edit comment, delete—verify works
- [ ] Add empty comment—should error
- [ ] Add very long comment—UI should handle
- [ ] Delete comment
- [ ] Verify @mentions work

## Notifications

- [ ] Check notification bell
- [ ] Mark notification as read
- [ ] Delete notification

## UI/UX & Performance

- [ ] Test on mobile (responsive design)
- [ ] Resize browser—layout responsive?
- [ ] Buttons tappable on mobile?
- [ ] Scroll through long task lists—performance OK?
- [ ] Refresh page and verify state persists (login)
- [ ] Test browser back/forward buttons
- [ ] Check console for errors (F12)
- [ ] Network tab—any failed requests?
- [ ] Test with slow network (DevTools throttle)

## Error Scenarios

- [ ] Disconnect internet mid-operation
- [ ] Let session expire (logout from other tab)
- [ ] API returns error—verify error message shown
- [ ] Try operations with invalid data

## Notes

Add any bugs or issues found here:

---
