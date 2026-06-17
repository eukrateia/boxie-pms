# PMS Testing Checklist

Test URL: https://boxie.helicoyd.com/pms/

## Authentication

- [ ] Sign up with new email
- [ ] Login with valid credentials
- [ ] Login with wrong password (error message)
- [ ] Login with non-existent email (error message)
- [ ] Logout and verify redirect to login

## Projects

- [ ] Create project (name + description)
- [ ] View all projects
- [ ] Edit project (name, description, status, color)
- [ ] Delete project (with confirmation)
- [ ] Verify project appears/disappears in list immediately

## Tasks

- [ ] Create task in a project
- [ ] View tasks by status (to-do, in-progress, in-review, done)
- [ ] Edit task details
- [ ] Change task status
- [ ] Delete task (with confirmation)
- [ ] Edit task priority

## Comments

- [ ] Add comment to a task
- [ ] Edit comment
- [ ] Delete comment
- [ ] Verify @mentions work

## Notifications

- [ ] Check notification bell
- [ ] Mark notification as read
- [ ] Delete notification

## General

- [ ] Test on mobile (responsive design)
- [ ] Refresh page and verify state persists (login)
- [ ] Test browser back/forward buttons
- [ ] Check console for errors (F12)
- [ ] Test with slow network (DevTools throttle)

## Notes

Add any bugs or issues found here:

---
