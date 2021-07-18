Dev notes

1. `/` When users visit the home page
    * A form for asking to start anon-msg is presented
    * This page won't show if there's an account already, unless cookies are cleared it will redirect to the dashboard.

2. `/dashboard` When users visit the dashboard page
    * They'll see the anonymous messages dropped for them.
    * With ability to delete messages
    * Only users having already stored cookies can access this page

3. `/settings` When users visit the settings page
    * They can delete there account(Simply clear cookie)
    * Clear all messages

4. `/add` When users post to the add route
    * The message will be added to the bucket together with the recipient's track id.

5. `/deleteOne` When users post to the delete route
    * The message with that id will be deleted.

6. `/deleteAll` When users post to the deleteAll route
    * All messages with the recipient(owner) track id will be deleted

7. `/getMsg` When users get this route
    * Without specifying pagination query values, it returns all messages
    * With the offset and limit query in url it will give a paginated result
    * It requires user to be loged in.

#### All messages will expire 3 days after creation

#### All user account will be deleted after 3 days of inactivity.