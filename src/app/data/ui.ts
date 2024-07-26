import { FaGithub, FaTwitter, FaLinkedin, FaYoutube, FaFacebook, FaTwitch, FaDev, FaCodepen, FaFreeCodeCamp, FaGitlab, FaStackOverflow, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { SiFrontendmentor, SiCodewars, SiHashnode } from 'react-icons/si';

const platformsData = [
  { id: 1, value: 'github', label: 'GitHub', icon: FaGithub, bg: '#1A1A1A', placeholder: 'https://github.com/username' },
  { id: 2, value: 'twitter', label: 'Twitter', icon: FaTwitter, bg: '#1DA1F2', placeholder: 'https://twitter.com/username' },
  { id: 3, value: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, bg: '#0A66C2', placeholder: 'https://linkedin.com/in/username' },
  { id: 4, value: 'youtube', label: 'YouTube', icon: FaYoutube, bg: '#FF0000', placeholder: 'https://youtube.com/c/channelname' },
  { id: 5, value: 'frontendMentor', label: 'FrontendMentor', icon: SiFrontendmentor, bg: '#3E54A3', placeholder: 'https://frontendmentor.io/profile/username' },
  { id: 6, value: 'facebook', label: 'Facebook', icon: FaFacebook, bg: '#1877F2', placeholder: 'https://facebook.com/username' },
  { id: 7, value: 'twitch', label: 'Twitch', icon: FaTwitch, bg: '#9146FF', placeholder: 'https://twitch.tv/username' },
  { id: 8, value: 'dev.to', label: 'Dev.to', icon: FaDev, bg: '#0A0A0A', placeholder: 'https://dev.to/username' },
  { id: 9, value: 'codewars', label: 'Codewars', icon: SiCodewars, bg: '#B1361E', placeholder: 'https://codewars.com/users/username' },
  { id: 10, value: 'codepen', label: 'Codepen', icon: FaCodepen, bg: '#000000', placeholder: 'https://codepen.io/username' },
  { id: 11, value: 'freeCodeCamp', label: 'freeCodeCamp', icon: FaFreeCodeCamp, bg: '#0A0A23', placeholder: 'https://freecodecamp.org/username' },
  { id: 12, value: 'gitlab', label: 'GitLab', icon: FaGitlab, bg: '#FCA121', placeholder: 'https://gitlab.com/username' },
  { id: 13, value: 'hashnode', label: 'Hashnode', icon: SiHashnode, bg: '#2962FF', placeholder: 'https://username.hashnode.dev' },
  { id: 14, value: 'stackOverflow', label: 'StackOverflow', icon: FaStackOverflow, bg: '#F48024', placeholder: 'https://stackoverflow.com/users/userid/username' },
];

export {platformsData}