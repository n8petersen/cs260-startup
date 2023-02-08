# Checker
## Design
This is a simple website that will enable a user to create check lists for any occasion, whether it be a to-do List, a shopping list, etc. Each list can be shared with other registered users on the website. The tasks can have a title, a due date/time, and a description. There will be multiple ways to sort the lists: Custom sort by dragging the tasks, Sort by Due Date/Time, Filter completed. 


<img src="./screenshot.png" width="800" alt="Mock Design">

---
### Key Features
- Ability to export the list in several different manners
- Secure login over HTTPS
- Tasks are stored in a server-side database
- Users can share lists with other uses
- Users can see their lists as well as lists shared with them
- Can filter and sort by several parameters
- Can custom sort the lists

---

### What I've learned
- I've learned that during deploy, Caddy will sometimes have a file-lock on the file you are over-writing. To work around this, I added commands to my deploy script that will stop the Caddy service before the deploy, and restart it after.
- I've never used SVG before, so to get the 4 quarter-circles for the Simon game looking good took quite some time and effort.