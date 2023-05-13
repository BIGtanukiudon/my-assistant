# My-Assistant

A web application for conversing with an AI assistant using voice.  
The underlying technologies are Web Speech API + GPT-3.5-turbo API + VOICEVOX ENGINE.  
The application is intended to be run in a local environment, so no web server or similar infrastructure is provided.

## Prerequisites

- Docker `v20.10.21` or newer
- Docker Compose `v2.13.0` or newer
- Node `v18.13.0` or newer
- npm `v8.19.3` or newer

## Setup

### Obtain an OpenAI API Key

Generate an OpenAI API key [here](https://platform.openai.com/account/api-keys).  
Define the generated key in the `.env` file.

### Frontend

#### Install Packages

1. Navigate to the `my-assistant-client` directory.
2. Install the required packages:

```cmd
npm install
```

#### `.env` File

Create a `.env` file based on the `.env.template` file.  
The properties to define are as follows:

| Property                     | Description                      |          Default          |
| ---------------------------- | -------------------------------- | :-----------------------: |
| `VITE_OPEN_AI_API_KEY`       | OpenAI API key                   |             -             |
| `VITE_VOICEVOX_API_ENDPOINT` | API endpoint for VOICEVOX server | `http://localhost:50021/` |

## Execution

### Start Frontend Development Server

1. Navigate to the `my-assistant-client` directory.
2. Run the development server:

```cmd
npm run dev
```

### Start VOICEVOX Server

```
docker-compose up -d
```

By default, GPU usage is enabled.  
To use the CPU, define the appropriate configuration in `docker-compose.yml`.

## License & Disclaimer

This application is subject to the license of VOICEVOX ENGINE. Please refer to the [here](https://github.com/VOICEVOX/voicevox_engine) for the license terms of VOICEVOX ENGINE.  
The author of this application shall not be liable for any issues, damages, or defects arising from the use of this application. The use of this application is at your own risk. Please use it responsibly.

## References

- [VOICEVOX ENGINE -Github-](https://github.com/VOICEVOX/voicevox_engine)
