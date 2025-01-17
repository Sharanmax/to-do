# Todo App

A simple Todo application built with Expo, designed to work seamlessly on Android, iOS, and web. The web app runs on `localhost:8081`.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)

---

## Prerequisites

Ensure you have the following installed on your system:

1. [Node.js](https://nodejs.org/) (version >= 16)
2. [Yarn](https://yarnpkg.com/)
3. [Expo CLI](https://docs.expo.dev/get-started/installation/)

To install Expo CLI globally, run:
```bash
npm install -g expo-cli
```

---

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Sharanmax/to-do.git
   cd to-do

   ```

2. Install the dependencies using Yarn:
   ```bash
   yarn install
   ```

---

## Running the Project

### Start the Web App on localhost:8081

1. Start the Expo development server:
   ```bash
   yarn start
   ```

2. Select the **Web** option from the Expo CLI interactive menu or run:
   ```bash
   yarn web
   ```

3. Open your web browser and navigate to:
   ```
   http://localhost:8081
   ```

### Running on Other Platforms

- **Android**: 
  ```bash
  yarn android
  ```

- **iOS**: 
  ```bash
  yarn ios
  ```

