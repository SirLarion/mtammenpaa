import React from "react";
import styled from "styled-components";

import netflix from "./assets/netflix.svg";
import disney from "./assets/disney.svg";
import hbo from "./assets/hbo.svg";
import youtube from "./assets/youtube.svg";
import soundcloud from "./assets/soundcloud.svg";
import spotify from "./assets/spotify.svg";
import prime from "./assets/prime.svg";
import github from "./assets/github.svg";
import somafm from "./assets/somafm.svg";
import calendar from "./assets/calendar.svg";
import mycourses from "./assets/mycourses.svg";
import aplus from "./assets/aplus.svg";
import miro from "./assets/miro.svg";
import figma from "./assets/figma.svg";
import steam from "./assets/steam.svg";
import vscode from "./assets/vscode.svg";
import pirate from "./assets/pirate.svg";

import { TAppMap } from "./types";

const StyledIcon = styled.img`
  width: 20vw;
  height: 20vw;
  min-width: 14rem;
  min-height: 14rem;
`;

export const APPLICATION_NAMES = [
  "netflix",
  "disney",
  "hbo",
  "youtube",
  "soundcloud",
  "spotify",
  "prime",
  "github",
  "somafm",
  "calendar",
  "mycourses",
  "aplus",
  "miro",
  "figma",
  "steam",
  "vscode",
  "pirate",
] as const;

export const APPLICATION_LINKS: TAppMap = {
  netflix: {
    url: "https://netflix.com",
    icon: <StyledIcon src={netflix} alt="netflix" />,
  },
  disney: {
    url: "https://disneyplus.com",
    icon: <StyledIcon src={disney} alt="disney+" />,
  },
  hbo: {
    url: "https://hbomax.com",
    icon: <StyledIcon src={hbo} alt="hbomax" />,
  },
  youtube: {
    url: "https://youtube.com",
    icon: <StyledIcon src={youtube} alt="youtube" />,
  },
  soundcloud: {
    url: "https://soundcloud.com",
    icon: <StyledIcon src={soundcloud} alt="soundcloud" />,
  },
  spotify: {
    url: "https://open.spotify.com",
    icon: <StyledIcon src={spotify} alt="spotify" />,
  },
  prime: {
    url: "https://www.primevideo.com",
    icon: <StyledIcon src={prime} alt="prime" />,
  },
  github: {
    url: "https://github.com",
    icon: <StyledIcon src={github} alt="github" />,
  },
  calendar: {
    url: "https://calendar.google.com/",
    icon: <StyledIcon src={calendar} alt="calendar" />,
  },
  somafm: {
    url: "https://somafm.com/player/#/now-playing/groovesalad",
    icon: <StyledIcon src={somafm} alt="somafm" />,
  },
  mycourses: {
    url: "https://mycourses.aalto.fi/",
    icon: <StyledIcon src={mycourses} alt="mycourses" />,
  },
  aplus: {
    url: "https://plus.cs.aalto.fi/",
    icon: <StyledIcon src={aplus} alt="aplus" />,
  },
  miro: {
    url: "https://miro.com/",
    icon: <StyledIcon src={miro} alt="miro" />,
  },
  figma: {
    url: "https://figma.com/",
    icon: <StyledIcon src={figma} alt="figma" />,
  },
  steam: {
    url: "http://localhost:12345/run/steam",
    icon: <StyledIcon src={steam} alt="steam" />,
  },
  vscode: {
    url: "http://localhost:12345/run/code",
    icon: <StyledIcon src={vscode} alt="vscode" />,
  },
  pirate: {
    url: "/pirate-theater",
    icon: <StyledIcon src={pirate} alt="pirate" />,
  },
};
