# Protolyst Tech Test

## Description
To create a ReactJS web application: a simple "message queue" system utilising redux as the store for the messages.

## Requirements As Sent

**The interface will be comprised of:**
- A text box to enter string text
- A button to submit a message
- A notification space to display messages for 5 seconds
 
**How it works:**
- When the user clicks the button to submit the message (string contained in the text box) it will be added into the redux store.
- A component should retrieve the message from the redux store, and it should be displayed on the screen within the notification space.
- After a 5 second delay, the message should be removed from the store, which in turn removes it from the component displaying it and the screen.

**Considerations:**
 
- You can use as many or few react components as you like BUT they must be functional components, and not class based components.
- It should be possible to add multiple messages to the queue. e.g. At 0 seconds we enter a message press the button, then 1 second later we enter a new message press the button again. We should see **two** messages on screen. Then at 5 seconds the first one should disappear (5 seconds after it was added), and then at 6 seconds in, the second one should disappear (5 seconds after it was added).


## Submission Info
I greatly enjoyed this exercise and extended it to include a themed UI and animations.

Due to this, the removal timer was intentionally extended for a better user experience.

## Further Extension Post Submission

In an effort to hit the ground running upon securing the role, I asked whether there was anything I could learn or practice before starting.
As I would be using Firestore extensively, I worked on integrating it to store messages to allow for realtime chatting using the app.

The repository includes a series of tests to demonstrate my testing capabilities.

## 2023 Update

Did some general cleaning up based on skills gained in my last two roles.

To refamiliarise myself with TypeScript, I converted the project from JavaScript to TypeScript.

I added react-speech-recognition for voice to text transcribing.

## Future Considerations

If I work on this project in the future, possible improvements include:
- Convert the project to Typescript
- Use Cloud Functions to delete the messages after a set time (not available for free)
- Implement Auth and friend system to allow easy connections to other users
- Implement security rules to restrict access to those who are authorised

## Setup
1 - Clone the repository.\
2 - Install dependencies with ```yarn install``` or ```npm install```.\
3 - Run ```yarn start``` or ```npm run start``` in the project directory from the command line .\
4 - Open [http://localhost:3000](http://localhost:3000) to view it in the browser.\
5 - Run ```yarn test``` or ```npm run test``` to run tests.

## Hosted Link
#### [Link](https://ghost-messenger.petedev.co.uk/) to live site.
