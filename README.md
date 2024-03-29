# Checkerly

## Hosted at [startup.n8petersen.link](https://startup.n8petersen.link).

--- 

## Design
This is a simple website that will enable a user to create check lists for any occasion, whether it be a to-do List, a shopping list, etc. Each list can be shared with other registered users on the website. The tasks can have a title, a due date ~~/time~~ , and a description. There will be multiple ways to sort the lists: ~~Custom sort by dragging the tasks~~, Sort by Due Date ~~/Time~~ , Filter completed. 


<img src="./screenshot.png" width="800" alt="Mock Design">

---

### Key Features
- Secure login over HTTPS
- Tasks are stored in a server-side database
- Can filter and sort ~~by several parameters~~
- ~~Ability to export the list in several different manners~~
- ~~Users can share lists with other users~~
- ~~Users can see their lists as well as lists shared with them~~

---

### What I've learned
- I've learned that during deploy, Caddy will sometimes have a file-lock on the file you are over-writing. To work around this, I added commands to my deploy script that will stop the Caddy service before the deploy, and restart it after.
- I've never used SVG before, so to get the 4 quarter-circles for the Simon game looking good took quite some time and effort.
- Vertically aligning elements in CSS is much harder than it probably needs to be, but using some `transform: translate` magic , it is possible.
---
- While Bootstrap makes it really easy to quickly customize a website and make it beautiful, there are only so many pre-determined things you can do to a website. Therefore a Bootstrap website looks very much like... well a Bootstrap website.
- While Bootstrap makes it easy to customize a website, it is easy to feel limited by its functionality. It is important to remember that Bootstrap should be used in addition to regular CSS, not as a replacement. It is intended to make repetitive tasks easier and quicker, but you can and still should customize things with regular ol' CSS.
- When utilizing Bootstrap, it is important to confirm your bootstrap version when consulting the documentation. I spent a long time frustrated that my page wasn't behaving the way the documentation was showing, but then I discovered I was on the page for an outdated Bootstrap version.
- I spent a long time getting my page to look nice on desktop, but when I tried the mobile version it looked horendous. I will have to work a little bit more to get it to look right on the mobile version. It is specifically the width of the body that is having issues, the rest is okay.
---
- Debugging in the browser DevTools is very useful when you can't figure out what is wrong with your program. My Simon wasn't working, but I saw there was an error with the reset() function, so I set a breakpoint on that function, and stepped through it until I saw an obvious issue: There was no addButton() function, which the reset() function calls. I had mispelled my function definition, so I fixed that and everything worked.
---
- JSON file format is awesome because JS has build in parsing functions for it to turn it into a JS object that you can use. I easily added a time to the scoreboard but adding that to the JSON object when it saved to local storage, and then added that to the part of scores.js that modifies the DOM.
- The tasks list was actually a bit more complicated than I thought it would be.
- Getting the form to format nicely with bootstrap while also still being functional with the javascript ended up also being a pain, so I gave up for a bit, but then revisited and got the text-forms looking how I wanted.
- A lot of the functionality is actually pretty database dependent, so I got the basic functionality of it working, but didn't want to waste too much time with code I'm going to have to totally re-write once the back-end is done, so I didn't do all of it.
- When implementing back-end javascript, very little has to change with the original front-end javascript. The original javascript can be served as static files, and you only have to change the parts that interact directly with the back-end (usually through some sort of API endpoint). In the case of simon, we only had to update the front-end JS that interacted with the updating and getting of scores, otherwise all the gameplay, and login, and so forth was the same. 
---
- Environment Variables proved to be more troublesome than I would have expected. I updated them in my /etc/environment file, which echoing them out in the terminal directly worked fine, but the node instance was getting the wrong ones until I forced them to update by running `pm2 restart all --update-env`, which works temporarily. If I restart the AWS EC2 instance, it reverts back to the old database connection, despite the environment variables sticking, and even indicating so when you run `echo $<ENV_VAR>`. Even when I check what node is getting by running `node -e "console.log(process.env.MONGOUSER)"` it returns the new variables I would expect.
- I added a line to database.js that just console.log's the url it's assembled, and at first it outputs the old, incorrect connection string. When I use `pm2 restart simon --update-env` and then check the log, it uses the new one. I have no clue where its getting the old values from, I've removed them from virtually every file I could think to.
- So it seems like when I restart the AWS EC2 instance, the simon service finds the old environment variables instead of the new ones? I have to run `pm2 restart simon --update-env` every time the EC2 instance restarts to get it to recognize the new ones.
- I figured it out. pm2 stores the old env variables in `~/.pm2/dump.pm2`, so when pm2 comes back up it grabs it from there.
- To fix this, after running `pm2 restart all --update-env`, if you run `pm2 save` it will save the current configuration (with the new env variables) to that dump.pm2 file, so it won't revert back to the old ones when the EC2 Instance/pm2 restarts.
---
- The authentication wasn't too bad to implement on Simon. I can do something very similar, if not the exact same on my startup.
- I learned that using dotenv might be preferable to using the actual environment variables. It's easier to copy them between environments, and it silos off the variables to that specific service. This way if you have several mongo databases, you don't have to create a bunch of environment variables on your system you have to maintain, but rather you set each service up to have their own variables, that other services don't interact with. 
- I had wondered in the past how a server could initiate sending a message to a client without an http request being made, and I learned the answer is through WebSocket. This is a powerful tool where a client first sends an http request to a server, and the server then converts it into a webSocket connection where either side can send messages to the other, including the server.
---
- It was a lot more work to get my startup service going than I originally anticipated. Although the ideas can be simple, the implementation in code can be quite difficult, and there was a lot of overhaul needed.
- I learned the importance of async and await, I had lots of times when I was adding something to the database, but the backend was reading the database and sending it back to the client faster than it was adding stuff, so the newly added stuff wasn't showing up on the front end. 
- I had one setback that I spent 2 hours on, where I couldn't get any requests to actually send to the server. It would hit that part of the code, and then the website would refresh before it could actually do anything. After a couple hours of debugging and trying various things, I found it was because that button didn't have `type="button":` in the HTML tag. It was defaulting to something else (submit I think?) which was causing the page to refresh. Such a frustrating bug with such a simple fix.
- Most things weren't super hard, as much as time consuming.
- I decided that the friends implementation was going to take to long to make the deadline, so I had to cut it out for now, but will probably implement it later. It is going to require some database structure updates in order to implement.
- The websocket, while sort of clunky and silly for my app specifically, wasn't as hard to implement as I thought it would be. I was able to disect the code from simon to apply it to my own website, though I did have to change a LOT of things to get it to work properly. But it is a really cool system that I will definitely be looking for use cases in the future.
---
- I had some serious issues getting React to work in my local Dev environment, everytime I would run `npm start` or `npm run start` it would spit out this error saying `Invalid options objet. Dev Server has been initialized using an options object that does not match the API schema. - options.allowedHosts[0] should be a non-empty string`.
- I scowered the internet looking for resources, I tried updating my nodejs and npm versions, I tried updating my npm packages, I tried removing unecessary ones, all to no avail.
- The one fix I found on a random stackoverflow halfway down through the answers suggested I add the following env variable; `DANGEROUSLY_DISABLE_HOST_CHECK=true`. I tried that and it worked.
- It has to do with the proxy we were using to connect to the back-end service, which is only an issue in Dev, not in Prod. So after I finished debugging my program locally, I deployed it and it worked fine without that issue.
- What I learned is, Dev environments are weird and finnicky. Not sure what else to say.
