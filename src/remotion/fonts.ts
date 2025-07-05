// fonts.ts
import * as Inter   from '@remotion/google-fonts/Inter';
import * as Roboto  from '@remotion/google-fonts/Roboto';
import * as Poppins from '@remotion/google-fonts/Poppins';
import * as Anton   from '@remotion/google-fonts/Anton';
import * as ZenLoop from '@remotion/google-fonts/ZenLoop';
import * as Montserrat from '@remotion/google-fonts/Montserrat';
import * as SquadaOne from '@remotion/google-fonts/SquadaOne';
import * as AlfaSlabOne from '@remotion/google-fonts/AlfaSlabOne';
import * as Bangers from '@remotion/google-fonts/Bangers';
import * as Bitter from '@remotion/google-fonts/Bitter';
import * as Cabin from '@remotion/google-fonts/Cabin';
import * as Cinzel from '@remotion/google-fonts/Cinzel';
import * as CrimsonPro from '@remotion/google-fonts/CrimsonPro';
import * as DMSerifDisplay from '@remotion/google-fonts/DMSerifDisplay';

type Load = () => string;

export const FONT_LOADERS: Record<string, Load> = {
  "Inter":   () => Inter.loadFont('normal',  { weights: ["100"], subsets: ['latin'] }).fontFamily,
  "Inter SemiBold": () => Inter.loadFont('normal',  { weights: ["600"], subsets: ['latin'] }).fontFamily,
  "Inter ExtraBold": () => Inter.loadFont('normal',  { weights: ["800"], subsets: ['latin'] }).fontFamily,
  "Roboto":  () => Roboto.loadFont('normal', { weights: ["400"], subsets: ['latin'] }).fontFamily,
  "Roboto SemiBold": () => Roboto.loadFont('normal', { weights: ["600"], subsets: ['latin'] }).fontFamily,
  "Roboto ExtraBold": () => Roboto.loadFont('normal', { weights: ["800"], subsets: ['latin'] }).fontFamily,
  "Poppins": () => Poppins.loadFont('normal',{ weights: ["400"], subsets: ['latin'] }).fontFamily,
  "Poppins SemiBold": () => Poppins.loadFont('normal',{ weights: ["600"], subsets: ['latin'] }).fontFamily,
  "Poppins ExtraBold": () => Poppins.loadFont('normal',{ weights: ["800"], subsets: ['latin'] }).fontFamily,
  "Montserrat": () => Montserrat.loadFont('normal',{ weights: ["400"], subsets: ['latin'] }).fontFamily,
  "Montserrat SemiBold": () => Montserrat.loadFont('normal',{ weights: ["600"], subsets: ['latin'] }).fontFamily,
  "Montserrat ExtraBold": () => Montserrat.loadFont('normal',{ weights: ["800"], subsets: ['latin'] }).fontFamily,
  "Anton":   ()=> Anton.loadFont().fontFamily,
  "Zen Loop": ()=> ZenLoop.loadFont().fontFamily,
  "Squada One": () => SquadaOne.loadFont().fontFamily,
  "Alfa Slab One": () => AlfaSlabOne.loadFont().fontFamily,
  "Bangers": () => Bangers.loadFont().fontFamily,
  "Bitter": () => Bitter.loadFont().fontFamily,
  "Cabin": () => Cabin.loadFont().fontFamily,
  "Cinzel": () => Cinzel.loadFont().fontFamily,
  "Crimson Pro": () => CrimsonPro.loadFont().fontFamily,
  "DM Serif Display": () => DMSerifDisplay.loadFont().fontFamily,
};
