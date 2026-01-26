# Improvements:

### Frontend

1. For avatar, initially we'll display first initials of name and surname, since avatar is not available at start
2. For now, in settings only add change password feature
3. To show members of a board, use aceternity UI's animated tooltip component

### Backend

- User

1. Improve user schema -> add name, avatar, role
2. Add new routes -> delete account, update user details, change avatar, active boards, task stats (completed tasks, pending tasks, total assigned tasks), change password.

- Board

1. Implement members feature
2. Improve Board schema -> improve background, add visibility, shareable links
3. In members, rather than just storing their id's, we can give roles and as per that they'll have edit access of board
4. If possible, track activity ( This is slightly advance, yet important feature )

- Card

1. Implement comments feature
2. Improve Card schema -> replace completed with status, add priority, allow color coded tags for better UI ( make a seperate schema for lables ), add attachments.