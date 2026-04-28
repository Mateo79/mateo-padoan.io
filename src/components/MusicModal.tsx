import { useState, useEffect, useRef } from 'react';
import { 
  FaTimes, 
  FaPlay, 
  FaPause, 
  FaStepBackward, 
  FaStepForward, 
  FaRandom, 
  FaMusic, 
  FaArrowLeft, 
  FaHeadphones,
  FaVolumeUp, 
  FaVolumeDown, 
  FaVolumeMute
} from './icons/ReactIcons';

// Playlist organisée par genre
const musicLibrary: Record<string, string[]> = {
  random: [
    'https://soundcloud.com/viperrecordings/tyr-kohout-x-flint-figure-same-old-story-ft-flowanastasia-vpr378',
    'https://soundcloud.com/cvmplaint/vulcan-y2k-alternative',
    'https://soundcloud.com/yuxanne/dawn-motivation-b-gone-fr-wip',
    'https://soundcloud.com/kobaryo/bookmaker',
    'https://soundcloud.com/kobaryofan/kobaryo-raven-emperor-absolute-version',
    'https://soundcloud.com/kobaryo/kobaryo-perfect-neglect-fc-super-reunion',
    'https://soundcloud.com/kobaryo/tas',
    'https://soundcloud.com/kobaryo/glitched-character',
    'https://soundcloud.com/kobaryo/eternal-ending',
    'https://soundcloud.com/kobaryofan/kobaryo-sparkling-software-v20',
    'https://soundcloud.com/kobaryofan/kobaryo-heavens-gateway-feat-persian-groovies',
    'https://soundcloud.com/xxcanexi/nauchus-letat-140bpm-club-remix',
    'https://soundcloud.com/elayb2/bloodfeud',
    'https://soundcloud.com/roseanamore/mia',
    'https://soundcloud.com/kobaryofan/kobaryo-computer-cornflakes',
    'https://soundcloud.com/clement-851588438/kobaryo-demise',
    'https://soundcloud.com/enmity1/revnuyu',
    'https://soundcloud.com/sghennyy/sghenny-touch-the-sky',
    'https://soundcloud.com/odcodone/to-whom-it-may-concern-200bpm',
    'https://soundcloud.com/shinyflvres/theyre-after-you-w-seoyxl-2',
    'https://soundcloud.com/cosmogrph/the-harvester',
    'https://soundcloud.com/tembio-436518684/pvkarmanationsrecords-slvps-vjqhs-320kbps',
    'https://soundcloud.com/kyotobetray/nutsintrance',
    'https://soundcloud.com/angst1337/limbo-angst-bootleg',
    'https://soundcloud.com/user-488142238/fomo',
    'https://soundcloud.com/8238/3463463l',
    'https://soundcloud.com/vuli-from-tokyo/emotions2',
    'https://soundcloud.com/anguish333/i-fucked-envys-sister',
    'https://soundcloud.com/rhe4/aether-distortion',
    'https://soundcloud.com/r4elc/sapphire',
    'https://soundcloud.com/startrancexo/deep-ocean',
    'https://soundcloud.com/startrancexo/bpf0emtmbnjv',
    'https://soundcloud.com/the-techno-community/premiere-kawero-go-insane-free',
    'https://soundcloud.com/synami/therians-and-holotheres-cant-get-enough',
    'https://soundcloud.com/soundweave_le/take-it-all',
    'https://soundcloud.com/saturninexo/encode',
    'https://soundcloud.com/djsquidgyblack/jumpluff',
    'https://soundcloud.com/t_h_t_p/nr-hard-031-track-04-5',
    'https://soundcloud.com/novathree/proxima',
    'https://soundcloud.com/tuna-172048103/cold-remains',
    'https://soundcloud.com/skop-skopez/03-nostalgic-portal-sko-kain',
    'https://soundcloud.com/tuna-172048103/atmung-w-stillscapes',
    'https://soundcloud.com/ynnivmusic/synrise',
    'https://soundcloud.com/roseanamore/mia',
    'https://soundcloud.com/puhf/idontloveyouanymore',
    'https://soundcloud.com/cristhasaint/credits-song-for-my-death-but-i-cant-let-you-win',
    'https://soundcloud.com/higher_recordings/survival',
    'https://soundcloud.com/tokyopill/lets-all-love-lain',
    'https://soundcloud.com/fluxator-1/kako-to-no-ketsubetsu',
    'https://soundcloud.com/nocopyrightsounds/rival-throne-ft-neoni-lost-identities-remix-ncs-release',
    'https://soundcloud.com/djnightcore/nightcore-dam-dadi-do',
    'https://soundcloud.com/yaniser/camellia-feat-yukacco-be-wild-trap',
    'https://soundcloud.com/user-198341359/avenger-2-naruto-ost-3',
    'https://soundcloud.com/djdarktek/darktek-vs-alryk-badboi-full-version-in-description',
    'https://soundcloud.com/puru/grimheart',
    'https://soundcloud.com/phoque-off-loli/venten-records-pvventenrecords',
    'https://soundcloud.com/phoque-off-loli/records-pvrecords',
    'https://soundcloud.com/lancyure-rathlion/black-tar',
    'https://soundcloud.com/loli-with-a-gun/uk-hardcore-bootleg',
    'https://soundcloud.com/hysia_sucks/trauma-never-cares-for-casualty',
    'https://soundcloud.com/narava-lapatta/laur-dangeroooous-jungle-from',
    'https://soundcloud.com/user-971632419/birth-of-a-wish',
    'https://soundcloud.com/user-971632419/a-beautiful-song',
    'https://soundcloud.com/user-971632419/city-ruins-rays-of-light',
    'https://soundcloud.com/user-971632419/the-sound-of-the-end',
    'https://soundcloud.com/sghennyy/sghenny-touch-the-sky',
    'https://soundcloud.com/odcodone/to-whom-it-may-concern-200bpm',
    'https://soundcloud.com/cosmogrph/were-never-giving-up',
    'https://soundcloud.com/flan-la/hunters-high',
    'https://soundcloud.com/g4ngcollective/avelno-kickball',
    'https://soundcloud.com/chaoskopp/smooth_operator_chaoskopp_remix',
    'https://soundcloud.com/40k1_694995225/r-906-40k1-bootleg',
    'https://soundcloud.com/beansclub2/disregard',
    'https://soundcloud.com/duzyyy/skkin',
    'https://soundcloud.com/mekapr/sex-madness11',
    'https://soundcloud.com/kizunashoujo/magi-sinbad-no-bouken-ost-03-kiseki-no-kochild-of-miracle',
    'https://soundcloud.com/oxycodonee/411a',
    'https://soundcloud.com/barschmellow/c-o-m-a',
    'https://soundcloud.com/barschmellow/t-r-a-u-m-e',
    'https://soundcloud.com/0den/guardian_angel',
    'https://soundcloud.com/lxv47/dopamine',
    'https://soundcloud.com/c3nobia/feelmemp3',
    'https://soundcloud.com/aurora-labyrinth/good3nough',
    'https://soundcloud.com/djtimmypizza/garbage-can-1',
    'https://soundcloud.com/ctrlfr33k/securely-connected-ft-yousei-crystalized',
    'https://soundcloud.com/crigston/fdsfsd',
    'https://soundcloud.com/cvmplaint/i-want-you-to-know',
    'https://soundcloud.com/youseida/disfiguration',
    'https://soundcloud.com/midbooze/aoc',
    'https://soundcloud.com/cierra_myst/ovverdose',
    'https://soundcloud.com/edena-edena/hentai11',
    'https://soundcloud.com/ctrlfr33k/la-serenixxima',
    'https://soundcloud.com/n0rooo/sex-sex-sex',
    'https://soundcloud.com/elayb2/move-it',
    'https://soundcloud.com/silvv3rr/before-i-talked-to-an-angel',
    'https://soundcloud.com/enablesecret/syntheticheart',
    'https://soundcloud.com/3zraa11101/essences33ker',
    'https://soundcloud.com/dillzytante2/promare-ost-shes',
    'https://soundcloud.com/dillzytante2/promare-ost-bangbangbur-n',
    'https://soundcloud.com/dillzytante2/promare-ost-shes-returns',
    'https://soundcloud.com/dillzytante2/promare-ost-gallant-ones',
    'https://soundcloud.com/3xod1a/825-hp',
    'https://soundcloud.com/dvrstmusic/im-sorry',
    'https://soundcloud.com/dvrstmusic/until-the-stars-collide',
    'https://soundcloud.com/dvrstmusic/dvrst-leah-julia-across-the-sky-original-mix',
    'https://soundcloud.com/dvrstmusic/dvrst-this-place-is-near-you',
    'https://soundcloud.com/dvrstmusic/your-name',
    'https://soundcloud.com/nyankovsky/neural-teleport',
    'https://soundcloud.com/c3nobia/energie',
    'https://soundcloud.com/ilytoo/monsterxd',
    'https://soundcloud.com/edena-edena/love-me-better',
    'https://soundcloud.com/enablesecret/speakeasy-with-beansclub',
    'https://soundcloud.com/duzyyy/eclipse',
    'https://soundcloud.com/ki-me-989329449/2007-trance',
    'https://soundcloud.com/3zraa11101/myknifeontheirwings',
    'https://soundcloud.com/volfarr/mili-sustain-ghost-in-the',
    'https://soundcloud.com/delusionenjoyer/offline',
    'https://soundcloud.com/w07ves/just-you-and-me',
    'https://soundcloud.com/dustcolor/level-1-trance-angel',
    'https://soundcloud.com/rames221/pokemon-sun-and-moon-vs-gladion-remix',
    'https://soundcloud.com/love-me-please-87270591/i',
    'https://soundcloud.com/luuxlu/chuu',
    'https://soundcloud.com/oxycodonee/close-to-you',
    'https://soundcloud.com/xhdidwhat/grasping-for-colour-feat-kasane-teto-vietnam-osu-championship',
    'https://soundcloud.com/awwtrauma/vibrant-breakcore-prod',
    'https://soundcloud.com/foreveroutoftouch/you-better-make-it-count',
    'https://soundcloud.com/juanista/euphoria',
    'https://soundcloud.com/sadkeyboardguy/voidshader',
    'https://soundcloud.com/ilytoo/aaaaaaaaa-feat-fgivem3',
    'https://soundcloud.com/kyuro3_yutrazium/yutrazium-you-fc-exegesis',
    'https://soundcloud.com/xhdidwhat/xh-kyuro3-yutrazium-reflection-fc-hardcore-utopia-6',
    'https://soundcloud.com/xhdidwhat/biohazard',
    'https://soundcloud.com/ilytoo/self-destructive-impulsivity2',
    'https://soundcloud.com/frailtyxd/overload',
    'https://soundcloud.com/mekapr/divinity-club',
    'https://soundcloud.com/onlytr4nce/dwams-surrender',
    'https://soundcloud.com/dreamloader/som-jag',
    'https://soundcloud.com/ctrlfr33k/faerie-earrings-crystallized',
    'https://soundcloud.com/ctrlfr33k/vaelkrimania',
    'https://soundcloud.com/ctrlfr33k/7th-heaven-ft-c3ntell4',
    'https://soundcloud.com/ctrlfr33k/8a9753b1-7a9f-403d-aff0-e55052390daa',
    'https://soundcloud.com/ctrlfr33k/glass-rose-1',
    'https://soundcloud.com/ctrlfr33k/eternaluv-remaster',
    'https://soundcloud.com/ctrlfr33k/chasteness-of-seagirls-instrumental',
    'https://soundcloud.com/belavie/kill-eva-popstar-belavie-edit',
    'https://soundcloud.com/dwams/skyfire',
    'https://soundcloud.com/aexhy/haiyti-lumen-aexhy-sonny-smiles-rework',
    'https://soundcloud.com/hocshin/reflective',
    'https://soundcloud.com/onlytr4nce/zwyrg-beyond-closure',
    'https://soundcloud.com/onlytr4nce/zwyrg-polarity',
    'https://soundcloud.com/onlytr4nce/asure2001-apex',
    'https://soundcloud.com/scattle/cypariss-puhf-blessed-by-the',
    'https://soundcloud.com/rakuno_alpha/rakuno-doomsday-fc-artificial-world-records-autumn-2023',
    'https://soundcloud.com/maxx-469356500/anomaly',
    'https://soundcloud.com/scattle/cypariss-b-l-n-t-alohaii-shiki',
    'https://soundcloud.com/scattle/cypariss-puhf-my-cage',
    'https://soundcloud.com/scattle/empty-dreams',
    'https://soundcloud.com/scattle/empty-dreams-speed-up',
    'https://soundcloud.com/nxc-angels/nxcangels18',
    'https://soundcloud.com/senuashi/forever-together',
    'https://soundcloud.com/scattle/cypariss-mzmff-hvra-love-story',
    'https://soundcloud.com/fgivem33/motion-blur',
    'https://soundcloud.com/coldx76/90-lg',
    'https://soundcloud.com/frailtyxd/headlock',
    'https://soundcloud.com/r4elc/solvernia',
    'https://soundcloud.com/cierra_myst/should-i-kill-you',
    'https://soundcloud.com/gate_16/your-eyes',
    'https://soundcloud.com/aitanaxxoficial/shadows-1',
    'https://soundcloud.com/vjorka/hyperreality-w-nuphory',
    'https://soundcloud.com/nuphory/timescape',
    'https://soundcloud.com/telemist/cheerleader',
    'https://soundcloud.com/hiimtype_r/feywild',
    'https://soundcloud.com/beauzworld/lick-it',
    'https://soundcloud.com/purityfilter/life-after-trance',
    'https://soundcloud.com/djglompstyle/the-hexeror',
    'https://soundcloud.com/oxycodonee/out-of-time',
    'https://soundcloud.com/yuxanne/dawn-motivation-b-gone-fr-wip',
    'https://soundcloud.com/club-accela/iddics-i-feel-so-untouched',
    'https://soundcloud.com/aphinitymusic/velocity',
    'https://soundcloud.com/sworjmusic/sworj-1',
    'https://soundcloud.com/dwams/s-agel-1-if',
    'https://soundcloud.com/hiimtype_r/flowers-of-antimony',
    'https://soundcloud.com/ultima_aevum/tears-of-the-abyss-single',
    'https://soundcloud.com/nuphory/snowblind',
    'https://soundcloud.com/tearstekk/cyber-inductance',
    'https://soundcloud.com/inoqx6/june',
    'https://soundcloud.com/animaxirius/create-find-exist-begin',
    'https://soundcloud.com/ninshoki/ascendbeyond',
    'https://soundcloud.com/cybermonk1249/data-downpour',
    'https://soundcloud.com/vindemiq/give-me-your-life',
    'https://soundcloud.com/djhuckey/6trance-4ver-mix',
    'https://soundcloud.com/sakurafrost/timescape',
    'https://soundcloud.com/vjorka/voicesinmyhead',
    'https://soundcloud.com/8luejay/elegant',
    'https://soundcloud.com/thekingofthunderstruck/force-multipliers-between-borders-dj-huckey-6tranced-remix-hype-part',
    'https://soundcloud.com/krylix333/youresocreepy',
    'https://soundcloud.com/aslnxc/sbm',
    'https://soundcloud.com/d1ss0c1at1ng/bleed',
    'https://soundcloud.com/senuashi/wanna-be-a-star',
    'https://soundcloud.com/kobaryo/bookmaker',
    'https://soundcloud.com/kobaryofan/kobaryo-heavens-gateway-feat-persian-groovies',
    'https://soundcloud.com/kobaryofan/kobaryo-raven-emperor-absolute-version',
    'https://soundcloud.com/noriko-nemui/reformation-of-wings',
    'https://soundcloud.com/ayrea/twilight',
    'https://soundcloud.com/krylix333/is-that-love',
    'https://soundcloud.com/yukimeow0/addict',
    'https://soundcloud.com/samagonas/i-see-hard-but-i-go-harder',
    'https://soundcloud.com/molly_flac/ghost-girl',
    'https://soundcloud.com/enablesecret/dont-remind-me-rare',
    'https://soundcloud.com/d1ss0c1at1ng/split2',
    'https://soundcloud.com/d1ss0c1at1ng/facetime',
    'https://soundcloud.com/rl1805/nexus',
    'https://soundcloud.com/tearstekk/fractured',
    'https://soundcloud.com/viperrecordings/tyr-kohout-x-flint-figure-same-old-story-ft-flowanastasia-vpr378',
    'https://soundcloud.com/senuashi/you-left-me',
    'https://soundcloud.com/rl1805/forever',
    'https://soundcloud.com/kobaryofan/kobaryo-singularity-at-264e6-bpm',
    'https://soundcloud.com/dj-myosuke/dj-myosuke-feat-sacrifice-of-fools',
    'https://soundcloud.com/kobaryo/another-stage',
    'https://soundcloud.com/depnard/clock-control-dj-myosuke-remix',
    'https://soundcloud.com/4evrx/until-it-feels-like-nothing',
    'https://soundcloud.com/yv55ii/touch-screen-matrix-feat-zhnoi',
    'https://soundcloud.com/inoqx6/closing230',
    'https://soundcloud.com/hahaahahahahah/out-of-time',
    'https://soundcloud.com/1_1_2353/06o',
    'https://soundcloud.com/melanchol1sch/unavailable',
    'https://soundcloud.com/juanista/my-last-feeling-for-you',
    'https://soundcloud.com/4evrx/feeling-everything-at-once',
    'https://soundcloud.com/4evrx/soulflux',
    'https://soundcloud.com/djkurara/fading-echoes-inoqx-remix',
    'https://soundcloud.com/anguishvx/anguish-zyzek-nic-nie-powiem-ft-inoqx-xcold-2',
    'https://soundcloud.com/xxcanexi/nauchus-letat-140bpm-club-remix',
    'https://soundcloud.com/anguishvx/anguish-zyzek-callthedoctor-ft-inoqx-1',
    'https://soundcloud.com/aitanaxxoficial/stayxxx',
    'https://soundcloud.com/krylix333/udontwanna',
    'https://soundcloud.com/senuashi/waiting-for-you',
    'https://soundcloud.com/inoqx6/screaming',
    'https://soundcloud.com/4evrx/wish-it-all-away',
    'https://soundcloud.com/odcodone/lp-printer',
    'https://soundcloud.com/elayb2/bloodfeud',
    'https://soundcloud.com/4evrx/cast-me-away',
    'https://soundcloud.com/saturninexo/shards',
    'https://soundcloud.com/r4elc/prtm',
    'https://soundcloud.com/sdnce/god_of_death-2049-1','https://soundcloud.com/saturninexo/sound-all-around-mp3',
    'https://soundcloud.com/r4elc/inversion',
    'https://soundcloud.com/dhackel/kobaryo-super-memories-x-feat',
    'https://soundcloud.com/exiled79/god-is-a-weapon',
    'https://soundcloud.com/tuna-172048103/brauch-ein-bisschen-mehr-w-s4turnine',
    'https://soundcloud.com/4evrx/flood-of-regret',
    'https://soundcloud.com/4evrx/prison-of-my-own-creation',
    'https://soundcloud.com/beansclub/eastern-air',
    'https://soundcloud.com/8luejay/die-her-hero',
    'https://soundcloud.com/reffectmental/desolate',
    'https://soundcloud.com/inoqx6/wish-6',
    'https://soundcloud.com/madtakkk/late',
    'https://soundcloud.com/4evrx/lie-to-me',
    'https://soundcloud.com/inoqx6/sharp-and-cold',
    'https://soundcloud.com/inoqx6/locked',
    'https://soundcloud.com/1_1_2353/chemicals-215bpm',
    'https://soundcloud.com/proxxxxy/edge',
    'https://soundcloud.com/inoqx6/decode',
    'https://soundcloud.com/beansclub/keepstraightuntilyouregone',
    'https://soundcloud.com/r4elc/megaton',
    'https://soundcloud.com/saturninexo/she-o-o',
    'https://soundcloud.com/saturninexo/fallapart',
    'https://soundcloud.com/ekittenkuba/im-losing-track-of-timeee-kuba-x-nequ-x-frost',
    'https://soundcloud.com/zesuna/l9st',
    'https://soundcloud.com/4evrx/little-scars',
    'https://soundcloud.com/qlysoon/nightmare',
    'https://soundcloud.com/inoqx6/cobain',
    'https://soundcloud.com/envyahahhahahahah/ronen-desolate',
    'https://soundcloud.com/beansclub/confession',
    'https://soundcloud.com/r4elc/ouroboros',
    'https://soundcloud.com/r4elc/never',
    'https://soundcloud.com/animarumrec/no-limit',
    'https://soundcloud.com/saturninexo/s4turnine-x-tuna-what-ur-not',
    'https://soundcloud.com/eren-jeager-252097410/apnea-direction',
    'https://soundcloud.com/xtortionofficial/amkiz-xtortion-nasty-trucker',
    'https://soundcloud.com/eren-jeager-252097410/apnea-only-one',
    'https://soundcloud.com/100101001011110101010111/i-saw-the-sky-pour-so-i-joined',
    'https://soundcloud.com/godkiller444/hate-that-i-need-u',
    'https://soundcloud.com/sensyss/rope',
    'https://soundcloud.com/lxv47/miliony-gwiazd',
    'https://soundcloud.com/senuashi/shark',
    'https://soundcloud.com/tekknophobic/clandestine-garden',
    'https://soundcloud.com/senuashi/lost',
    'https://soundcloud.com/oblivioss/shattered',
    'https://soundcloud.com/tekknophobic/heartless-x-kaiesa7-beg-for-it',
    'https://soundcloud.com/senuashi/upside-down',
    'https://soundcloud.com/reffectmental/cope-nequ-collab',
    'https://soundcloud.com/sakura3zuki/similar_thing',
    'https://soundcloud.com/marikotime/outside',
    'https://soundcloud.com/synami/fly',
    'https://soundcloud.com/bounceandbass/no-good-hard-techno',
    'https://soundcloud.com/artur-is-epic/acs-angel-dudeplaya',
    'https://soundcloud.com/user-231054673-869566063/rihanna-where-have-you-been-hardstyle-bootleg',
    'https://soundcloud.com/oblivioss/alone',
    'https://soundcloud.com/tr1nnity/ive-been-awake-for-days',
    'https://soundcloud.com/hahaahahahahah/ashes',
    'https://soundcloud.com/akuma_no_kusa/im-just-speaking-to-myself',
    'https://soundcloud.com/kanizox/kanizox-sanctum-25',
    'https://soundcloud.com/itsxyris/flow-of-wind',
    'https://soundcloud.com/zxnx/over',
    'https://soundcloud.com/inoqx6/everybody-dies-in-their-nightmares',
    'https://soundcloud.com/inoqx6/itsnotovertillitsover',
    'https://soundcloud.com/obsclght/serebro-remix-mne-malo-malo-malo-tebya',
    'https://soundcloud.com/11eter/eter-x-astroraver-x-xn88ax',
    'https://soundcloud.com/frostekk333/lolita-200bpm',
    'https://soundcloud.com/zxnx/dreamseekr',
    'https://soundcloud.com/imgonnahungmyselfxddd/can-u-send-me-nudes-i-stacked',
    'https://soundcloud.com/fish-dragon/kobaryo-invisible-frenzy-camellias-593-insanely-fluctuated-remix',
  ],

  hardcore: [
    'https://soundcloud.com/kobaryo/bookmaker',
    'https://soundcloud.com/zxnx/over',
    'https://soundcloud.com/inoqx6/everybody-dies-in-their-nightmares',
    'https://soundcloud.com/11eter/eter-x-astroraver-x-xn88ax',
    'https://soundcloud.com/inoqx6/itsnotovertillitsover',
    'https://soundcloud.com/frostekk333/lolita-200bpm',
    'https://soundcloud.com/marikotime/outside',
    'https://soundcloud.com/bounceandbass/no-good-hard-techno',
    'https://soundcloud.com/tr1nnity/ive-been-awake-for-days',
    'https://soundcloud.com/godkiller444/hate-that-i-need-u',
    'https://soundcloud.com/tekknophobic/clandestine-garden',
    'https://soundcloud.com/zxnx/dreamseekr',
    'https://soundcloud.com/tekknophobic/heartless-x-kaiesa7-beg-for-it',
    'https://soundcloud.com/akuma_no_kusa/im-just-speaking-to-myself',
    'https://soundcloud.com/reffectmental/cope-nequ-collab',
    'https://soundcloud.com/oblivioss/shattered',
    'https://soundcloud.com/senuashi/shark',
    'https://soundcloud.com/inoqx6/screaming',
    'https://soundcloud.com/lxv47/miliony-gwiazd',
    'https://soundcloud.com/100101001011110101010111/i-saw-the-sky-pour-so-i-joined',
    'https://soundcloud.com/oblivioss/alone',
    'https://soundcloud.com/sensyss/rope',
    'https://soundcloud.com/madtakkk/late',
    'https://soundcloud.com/senuashi/upside-down',
    'https://soundcloud.com/envyahahhahahahah/ronen-desolate',
    'https://soundcloud.com/inoqx6/cobain',
    'https://soundcloud.com/r4elc/ouroboros',
    'https://soundcloud.com/proxxxxy/edge',
    'https://soundcloud.com/1_1_2353/chemicals-215bpm',
    'https://soundcloud.com/inoqx6/locked',
    'https://soundcloud.com/zesuna/l9st',
    'https://soundcloud.com/reffectmental/desolate',
    'https://soundcloud.com/qlysoon/nightmare',
    'https://soundcloud.com/inoqx6/wish-6',
    'https://soundcloud.com/inoqx6/decode',
    'https://soundcloud.com/ekittenkuba/im-losing-track-of-timeee-kuba-x-nequ-x-frost',
    'https://soundcloud.com/inoqx6/sharp-and-cold',
    'https://soundcloud.com/senuashi/waiting-for-you',
    'https://soundcloud.com/odcodone/lp-printer',
    'https://soundcloud.com/krylix333/udontwanna',
    'https://soundcloud.com/inoqx6/closing230',
    'https://soundcloud.com/1_1_2353/06o',
    'https://soundcloud.com/anguishvx/anguish-zyzek-nic-nie-powiem-ft-inoqx-xcold-2',
    'https://soundcloud.com/anguishvx/anguish-zyzek-callthedoctor-ft-inoqx-1',
    'https://soundcloud.com/tearstekk/fractured',
    'https://soundcloud.com/elayb2/bloodfeud',
    'https://soundcloud.com/depnard/clock-control-dj-myosuke-remix',
    'https://soundcloud.com/8luejay/die-her-hero',
    'https://soundcloud.com/xxcanexi/nauchus-letat-140bpm-club-remix',
    'https://soundcloud.com/hahaahahahahah/ashes',
    'https://soundcloud.com/dj-myosuke/dj-myosuke-feat-sacrifice-of-fools',
    'https://soundcloud.com/kobaryo/another-stage',
    'https://soundcloud.com/kobaryofan/kobaryo-raven-emperor-absolute-version',
    'https://soundcloud.com/beansclub/eastern-air',
    'https://soundcloud.com/kobaryofan/kobaryo-singularity-at-264e6-bpm',
    'https://soundcloud.com/senuashi/you-left-me',
    'https://soundcloud.com/exiled79/god-is-a-weapon',
    'https://soundcloud.com/dhackel/kobaryo-super-memories-x-feat',
    'https://soundcloud.com/vindemiq/give-me-your-life',
    'https://soundcloud.com/yukimeow0/addict',
    'https://soundcloud.com/molly_flac/ghost-girl',
    'https://soundcloud.com/d1ss0c1at1ng/facetime',
    'https://soundcloud.com/samagonas/i-see-hard-but-i-go-harder',
    'https://soundcloud.com/senuashi/wanna-be-a-star',
    'https://soundcloud.com/beansclub/confession',
    'https://soundcloud.com/synami/fly',
    'https://soundcloud.com/krylix333/is-that-love',
    'https://soundcloud.com/kobaryofan/kobaryo-raven-emperor-absolute-version',
    'https://soundcloud.com/krylix333/youresocreepy',
    'https://soundcloud.com/d1ss0c1at1ng/split2',
    'https://soundcloud.com/thekingofthunderstruck/force-multipliers-between-borders-dj-huckey-6tranced-remix-hype-part',
    'https://soundcloud.com/kobaryo/kobaryo-perfect-neglect-fc-super-reunion',
    'https://soundcloud.com/kobaryo/tas',
    'https://soundcloud.com/inoqx6/june',
    'https://soundcloud.com/senuashi/lost',
    'https://soundcloud.com/8luejay/elegant',
    'https://soundcloud.com/kobaryo/glitched-character',
    'https://soundcloud.com/noriko-nemui/reformation-of-wings',
    'https://soundcloud.com/kobaryofan/kobaryo-heavens-gateway-feat-persian-groovies',
    'https://soundcloud.com/kobaryo/eternal-ending',
    'https://soundcloud.com/fish-dragon/kobaryo-invisible-frenzy-camellias-593-insanely-fluctuated-remix',
    'https://soundcloud.com/kobaryofan/kobaryo-sparkling-software-v20',
    'https://soundcloud.com/frailtyxd/headlock',
    'https://soundcloud.com/kobaryofan/kobaryo-heavens-gateway-feat-persian-groovies',
    'https://soundcloud.com/kobaryofan/kobaryo-computer-cornflakes',
    'https://soundcloud.com/clement-851588438/kobaryo-demise',
    'https://soundcloud.com/user-730432372/hellgirl-kena-frenchcore-remix',
    'https://soundcloud.com/kobaryo/bookmaker',
    'https://soundcloud.com/angst1337/limbo-angst-bootleg',
    'https://soundcloud.com/8238/3463463l',
    'https://soundcloud.com/vuli-from-tokyo/emotions2',
    'https://soundcloud.com/anguish333/i-fucked-envys-sister',
    'https://soundcloud.com/d1ss0c1at1ng/bleed',
    'https://soundcloud.com/roseanamore/mia',
    'https://soundcloud.com/loli-with-a-gun/uk-hardcore-bootleg',
    'https://soundcloud.com/narava-lapatta/laur-dangeroooous-jungle-from',
    'https://soundcloud.com/hahaahahahahah/out-of-time',
    'https://soundcloud.com/sghennyy/sghenny-touch-the-sky',
    'https://soundcloud.com/odcodone/to-whom-it-may-concern-200bpm',
    'https://soundcloud.com/djkurara/fading-echoes-inoqx-remix',
    'https://soundcloud.com/g4ngcollective/avelno-kickball',
    'https://soundcloud.com/lxv47/dopamine',
    'https://soundcloud.com/ilytoo/monsterxd',
    'https://soundcloud.com/kyuro3_yutrazium/yutrazium-you-fc-exegesis',
    'https://soundcloud.com/yuxanne/dawn-motivation-b-gone-fr-wip',
    'https://soundcloud.com/juanista/nightwis',
    'https://soundcloud.com/hiimtype_r/flowers-of-antimony',
  ],

  techno: [
    'https://soundcloud.com/viperrecordings/tyr-kohout-x-flint-figure-same-old-story-ft-flowanastasia-vpr378',
    'https://soundcloud.com/cvmplaint/vulcan-y2k-alternative',
    'https://soundcloud.com/xxcanexi/nauchus-letat-140bpm-club-remix',
    'https://soundcloud.com/odcodone/to-whom-it-may-concern-200bpm',
    'https://soundcloud.com/user-730432372/hellgirl-kena-frenchcore-remix',
    'https://soundcloud.com/sakura3zuki/similar_thing',
    'https://soundcloud.com/obsclght/serebro-remix-mne-malo-malo-malo-tebya',
    'https://soundcloud.com/itsxyris/flow-of-wind',
    'https://soundcloud.com/user-488142238/fomo',
    'https://soundcloud.com/cybermonk1249/data-downpour',
    'https://soundcloud.com/tearstekk/cyber-inductance',
    'https://soundcloud.com/animaxirius/create-find-exist-begin',
    'https://soundcloud.com/rhe4/aether-distortion',
    'https://soundcloud.com/xtortionofficial/amkiz-xtortion-nasty-trucker',
    'https://soundcloud.com/user-231054673-869566063/rihanna-where-have-you-been-hardstyle-bootleg',
    'https://soundcloud.com/the-techno-community/premiere-kawero-go-insane-free',
    'https://soundcloud.com/t_h_t_p/nr-hard-031-track-04-5',
    'https://soundcloud.com/skop-skopez/03-nostalgic-portal-sko-kain',
    'https://soundcloud.com/higher_recordings/survival',
    'https://soundcloud.com/sworjmusic/sworj-1',
    'https://soundcloud.com/artur-is-epic/acs-angel-dudeplaya',
    'https://soundcloud.com/telemist/cheerleader',
    'https://soundcloud.com/djnightcore/nightcore-dam-dadi-do',
    'https://soundcloud.com/yaniser/camellia-feat-yukacco-be-wild-trap',
    'https://soundcloud.com/scattle/empty-dreams-speed-up',
    'https://soundcloud.com/scattle/cypariss-puhf-blessed-by-the',
    'https://soundcloud.com/club-accela/iddics-i-feel-so-untouched',
    'https://soundcloud.com/coldx76/90-lg',
    'https://soundcloud.com/djdarktek/darktek-vs-alryk-badboi-full-version-in-description',
    'https://soundcloud.com/phoque-off-loli/venten-records-pvventenrecords',
    'https://soundcloud.com/phoque-off-loli/records-pvrecords',
    'https://soundcloud.com/cosmogrph/were-never-giving-up',
    'https://soundcloud.com/flan-la/hunters-high',
    'https://soundcloud.com/chaoskopp/smooth_operator_chaoskopp_remix',
    'https://soundcloud.com/beauzworld/lick-it',
    'https://soundcloud.com/nxc-angels/nxcangels18',
    'https://soundcloud.com/40k1_694995225/r-906-40k1-bootleg',
    'https://soundcloud.com/silvv3rr/before-i-talked-to-an-angel',
    'https://soundcloud.com/barschmellow/t-r-a-u-m-e',
    'https://soundcloud.com/cvmplaint/i-want-you-to-know',
    'https://soundcloud.com/nyankovsky/neural-teleport',
    'https://soundcloud.com/enablesecret/speakeasy-with-beansclub',
    'https://soundcloud.com/duzyyy/eclipse',
    'https://soundcloud.com/luuxlu/chuu',
    'https://soundcloud.com/xhdidwhat/grasping-for-colour-feat-kasane-teto-vietnam-osu-championship',
    'https://soundcloud.com/viperrecordings/tyr-kohout-x-flint-figure-same-old-story-ft-flowanastasia-vpr378',
    'https://soundcloud.com/sadkeyboardguy/voidshader',
    'https://soundcloud.com/xhdidwhat/biohazard',
    'https://soundcloud.com/aexhy/haiyti-lumen-aexhy-sonny-smiles-rework',
    'https://soundcloud.com/hocshin/reflective',
    'https://soundcloud.com/rakuno_alpha/rakuno-doomsday-fc-artificial-world-records-autumn-2023',
    'https://soundcloud.com/scattle/cypariss-b-l-n-t-alohaii-shiki',
    'https://soundcloud.com/scattle/cypariss-puhf-my-cage',
    'https://soundcloud.com/scattle/cypariss-mzmff-hvra-love-story',
    'https://soundcloud.com/r4elc/megaton',
    'https://soundcloud.com/scattle/empty-dreams',
  ],

  trance: [
    'https://soundcloud.com/yuxanne/dawn-motivation-b-gone-fr-wip',
    'https://soundcloud.com/ctrlfr33k/8a9753b1-7a9f-403d-aff0-e55052390daa',
    'https://soundcloud.com/melanchol1sch/unavailable',
    'https://soundcloud.com/fgivem33/motion-blur',
    'https://soundcloud.com/tuna-172048103/brauch-ein-bisschen-mehr-w-s4turnine',
    'https://soundcloud.com/saturninexo/fallapart',
    'https://soundcloud.com/gate_16/your-eyes',
    'https://soundcloud.com/4evrx/little-scars',
    'https://soundcloud.com/beansclub/keepstraightuntilyouregone',
    'https://soundcloud.com/juanista/my-last-feeling-for-you',
    'https://soundcloud.com/4evrx/wish-it-all-away',
    'https://soundcloud.com/saturninexo/s4turnine-x-tuna-what-ur-not',
    'https://soundcloud.com/r4elc/never',
    'https://soundcloud.com/vjorka/hyperreality-w-nuphory',
    'https://soundcloud.com/sdnce/god_of_death-2049-1',
    'https://soundcloud.com/animarumrec/no-limit',
    'https://soundcloud.com/saturninexo/she-o-o',
    'https://soundcloud.com/r4elc/inversion',
    'https://soundcloud.com/saturninexo/shards',
    'https://soundcloud.com/ninshoki/ascendbeyond',
    'https://soundcloud.com/4evrx/soulflux',
    'https://soundcloud.com/4evrx/cast-me-away',
    'https://soundcloud.com/enablesecret/dont-remind-me-rare',
    'https://soundcloud.com/rl1805/forever',
    'https://soundcloud.com/ultima_aevum/tears-of-the-abyss-single',
    'https://soundcloud.com/4evrx/until-it-feels-like-nothing',
    'https://soundcloud.com/aitanaxxoficial/stayxxx',
    'https://soundcloud.com/yv55ii/touch-screen-matrix-feat-zhnoi',
    'https://soundcloud.com/r4elc/solvernia',
    'https://soundcloud.com/rl1805/nexus',
    'https://soundcloud.com/juanista/nightwis',
    'https://soundcloud.com/4evrx/lie-to-me',
    'https://soundcloud.com/4evrx/feeling-everything-at-once',
    'https://soundcloud.com/ayrea/twilight',
    'https://soundcloud.com/purityfilter/life-after-trance', 
    'https://soundcloud.com/vjorka/voicesinmyhead',
    'https://soundcloud.com/r4elc/prtm',
    'https://soundcloud.com/saturninexo/sound-all-around-mp3',
    'https://soundcloud.com/nuphory/snowblind',
    'https://soundcloud.com/aphinitymusic/velocity',
    'https://soundcloud.com/hiimtype_r/feywild',
    'https://soundcloud.com/onlytr4nce/asure2001-apex',
    'https://soundcloud.com/dwams/s-agel-1-if',
    'https://soundcloud.com/djhuckey/6trance-4ver-mix',
    'https://soundcloud.com/aslnxc/sbm',
    'https://soundcloud.com/aitanaxxoficial/shadows-1',
    'https://soundcloud.com/senuashi/forever-together',
    'https://soundcloud.com/djglompstyle/the-hexeror',
    'https://soundcloud.com/oxycodonee/out-of-time',
    'https://soundcloud.com/maxx-469356500/anomaly',
    'https://soundcloud.com/nuphory/timescape',
    'https://soundcloud.com/sakurafrost/timescape',
    'https://soundcloud.com/onlytr4nce/zwyrg-beyond-closure',
    'https://soundcloud.com/onlytr4nce/zwyrg-polarity',
    'https://soundcloud.com/ctrlfr33k/glass-rose-1',
    'https://soundcloud.com/kyotobetray/nutsintrance',
    'https://soundcloud.com/ctrlfr33k/securely-connected-ft-yousei-crystalized',
    'https://soundcloud.com/oxycodonee/close-to-you',
    'https://soundcloud.com/cierra_myst/ovverdose',
    'https://soundcloud.com/edena-edena/hentai11',
    'https://soundcloud.com/ctrlfr33k/eternaluv-remaster',
    'https://soundcloud.com/ctrlfr33k/chasteness-of-seagirls-instrumental',
    'https://soundcloud.com/ctrlfr33k/vaelkrimania',
    'https://soundcloud.com/ctrlfr33k/7th-heaven-ft-c3ntell4',
    'https://soundcloud.com/ilytoo/self-destructive-impulsivity2',
    'https://soundcloud.com/frailtyxd/overload',
    'https://soundcloud.com/dreamloader/som-jag',
    'https://soundcloud.com/ctrlfr33k/faerie-earrings-crystallized',
    'https://soundcloud.com/ctrlfr33k/la-serenixxima',
    'https://soundcloud.com/mekapr/divinity-club',
    'https://soundcloud.com/onlytr4nce/dwams-surrender',
    'https://soundcloud.com/ilytoo/aaaaaaaaa-feat-fgivem3',
    'https://soundcloud.com/n0rooo/sex-sex-sex',
    'https://soundcloud.com/xhdidwhat/xh-kyuro3-yutrazium-reflection-fc-hardcore-utopia-6',
    'https://soundcloud.com/ki-me-989329449/2007-trance',
    'https://soundcloud.com/delusionenjoyer/offline',
    'https://soundcloud.com/w07ves/just-you-and-me',
    'https://soundcloud.com/elayb2/move-it',
    'https://soundcloud.com/crigston/fdsfsd',
    'https://soundcloud.com/enablesecret/do-u-believe-in-miracles',
    'https://soundcloud.com/belavie/kill-eva-popstar-belavie-edit',
    'https://soundcloud.com/dwams/skyfire',
    'https://soundcloud.com/dustcolor/level-1-trance-angel',
    'https://soundcloud.com/r4elc/sapphire',
    'https://soundcloud.com/startrancexo/deep-ocean',
    'https://soundcloud.com/3zraa11101/myknifeontheirwings',
    'https://soundcloud.com/edena-edena/love-me-better',
    'https://soundcloud.com/c3nobia/energie',
    'https://soundcloud.com/startrancexo/bpf0emtmbnjv',
    'https://soundcloud.com/synami/therians-and-holotheres-cant-get-enough',
    'https://soundcloud.com/soundweave_le/take-it-all',
    'https://soundcloud.com/saturninexo/encode',
    'https://soundcloud.com/3xod1a/825-hp',
    'https://soundcloud.com/djsquidgyblack/jumpluff',
    'https://soundcloud.com/novathree/proxima',
    'https://soundcloud.com/tuna-172048103/cold-remains',
    'https://soundcloud.com/tuna-172048103/atmung-w-stillscapes',
    'https://soundcloud.com/beansclub2/disregard',
    'https://soundcloud.com/duzyyy/skkin',
    'https://soundcloud.com/mekapr/sex-madness11',
    'https://soundcloud.com/oxycodonee/411a',
    'https://soundcloud.com/barschmellow/c-o-m-a',
    'https://soundcloud.com/0den/guardian_angel',
    'https://soundcloud.com/c3nobia/feelmemp3',
    'https://soundcloud.com/djtimmypizza/garbage-can-1',
    'https://soundcloud.com/youseida/disfiguration',
    'https://soundcloud.com/midbooze/aoc',
    'https://soundcloud.com/enablesecret/syntheticheart',
    'https://soundcloud.com/3zraa11101/essences33ker',
    'https://soundcloud.com/juanista/euphoria',
  ],

  ambient: [
    'https://soundcloud.com/cosmogrph/the-harvester',
    'https://soundcloud.com/roseanamore/mia',
    'https://soundcloud.com/shinyflvres/theyre-after-you-w-seoyxl-2',
    'https://soundcloud.com/ynnivmusic/synrise',
    'https://soundcloud.com/puhf/idontloveyouanymore',
    'https://soundcloud.com/cristhasaint/credits-song-for-my-death-but-i-cant-let-you-win',
    'https://soundcloud.com/4evrx/flood-of-regret',
    'https://soundcloud.com/eren-jeager-252097410/apnea-only-one',
    'https://soundcloud.com/tokyopill/lets-all-love-lain',
    'https://soundcloud.com/fluxator-1/kako-to-no-ketsubetsu', 
    'https://soundcloud.com/nocopyrightsounds/rival-throne-ft-neoni-lost-identities-remix-ncs-release',
    'https://soundcloud.com/imgonnahungmyselfxddd/can-u-send-me-nudes-i-stacked',
    'https://soundcloud.com/user-198341359/avenger-2-naruto-ost-3',
    'https://soundcloud.com/volfarr/mili-sustain-ghost-in-the',
    'https://soundcloud.com/puru/grimheart',
    'https://soundcloud.com/dvrstmusic/your-name',
    'https://soundcloud.com/dvrstmusic/dvrst-leah-julia-across-the-sky-original-mix',
    'https://soundcloud.com/eren-jeager-252097410/apnea-direction',
    'https://soundcloud.com/dvrstmusic/dvrst-this-place-is-near-you',
    'https://soundcloud.com/lancyure-rathlion/black-tar',
    'https://soundcloud.com/hysia_sucks/trauma-never-cares-for-casualty',
    'https://soundcloud.com/user-971632419/birth-of-a-wish',
    'https://soundcloud.com/user-971632419/a-beautiful-song',
    'https://soundcloud.com/4evrx/prison-of-my-own-creation',
    'https://soundcloud.com/yv55ii/touch-screen-matrix-feat-zhnoi',
    'https://soundcloud.com/user-971632419/city-ruins-rays-of-light',
    'https://soundcloud.com/user-971632419/the-sound-of-the-end',
    'https://soundcloud.com/kanizox/kanizox-sanctum-25',
    'https://soundcloud.com/kizunashoujo/magi-sinbad-no-bouken-ost-03-kiseki-no-kochild-of-miracle',
    'https://soundcloud.com/aurora-labyrinth/good3nough',
    'https://soundcloud.com/dillzytante2/promare-ost-shes',
    'https://soundcloud.com/dillzytante2/promare-ost-bangbangbur-n',
    'https://soundcloud.com/dillzytante2/promare-ost-shes-returns',
    'https://soundcloud.com/dillzytante2/promare-ost-gallant-ones',
    'https://soundcloud.com/dvrstmusic/im-sorry',
    'https://soundcloud.com/dvrstmusic/until-the-stars-collide',
    'https://soundcloud.com/rames221/pokemon-sun-and-moon-vs-gladion-remix',
    'https://soundcloud.com/love-me-please-87270591/i',
    'https://soundcloud.com/foreveroutoftouch/you-better-make-it-count',
    'https://soundcloud.com/awwtrauma/vibrant-breakcore-prod',
    'https://soundcloud.com/cierra_myst/should-i-kill-you',
  ],
};

interface MusicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewMode = 'genres' | 'player';

// Déclaration globale pour l'API SoundCloud
declare global {
  interface Window {
    SC: any;
  }
}

const MusicModal = ({ isOpen, onClose }: MusicModalProps) => {
  const [view, setView] = useState<ViewMode>('genres');
  const [selectedGenre, setSelectedGenre] = useState<string>('random');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentPlaylist, setCurrentPlaylist] = useState<string[]>([]);
  const [volume, setVolume] = useState(80);
  const [isShuffle, setIsShuffle] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<any>(null);
  const scApiReady = useRef(false);
  
  const stateRef = useRef({ currentTrackIndex, isShuffle, currentPlaylist });
  useEffect(() => {
    stateRef.current = { currentTrackIndex, isShuffle, currentPlaylist };
  }, [currentTrackIndex, isShuffle, currentPlaylist]);

  // Charger l'API Widget SoundCloud une seule fois
  useEffect(() => {
    if (scApiReady.current || window.SC) {
      scApiReady.current = true;
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    script.onload = () => { scApiReady.current = true; };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // Initialiser le widget et binder l'événement FINISH
  useEffect(() => {
    if (!isOpen || !iframeRef.current || !scApiReady.current || !window.SC) return;

    const initWidget = () => {
      try {
        widgetRef.current = window.SC.Widget(iframeRef.current);
        widgetRef.current.setVolume(volume);

        // Nettoyage précédent pour éviter les doublons
        widgetRef.current.unbind(window.SC.Widget.Events.FINISH);
        widgetRef.current.bind(window.SC.Widget.Events.FINISH, () => {
          handleNextTrack();
        });
      } catch (e) {
        console.warn('SoundCloud Widget init failed:', e);
      }
    };

    // Délai nécessaire pour que l'iframe charge complètement le nouveau morceau
    const timeout = setTimeout(initWidget, 800);
    return () => clearTimeout(timeout);
  }, [isOpen, currentPlaylist[currentTrackIndex], scApiReady.current]);

  // Mettre à jour le volume dynamiquement
  useEffect(() => {
    if (widgetRef.current) {
      widgetRef.current.setVolume(volume);
    }
  }, [volume]);

  // Logique de piste suivante (respecte le mode aléatoire)
  const handleNextTrack = () => {
    const { currentTrackIndex, isShuffle, currentPlaylist } = stateRef.current;
    if (currentPlaylist.length === 0) return;

    let nextIndex: number;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * currentPlaylist.length);
      while (nextIndex === currentTrackIndex && currentPlaylist.length > 1) {
        nextIndex = Math.floor(Math.random() * currentPlaylist.length);
      }
    } else {
      nextIndex = (currentTrackIndex + 1) % currentPlaylist.length;
    }
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    if (currentPlaylist.length === 0) return;
    setCurrentTrackIndex((prev) => (prev - 1 + currentPlaylist.length) % currentPlaylist.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (widgetRef.current) {
      isPlaying ? widgetRef.current.pause() : widgetRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Charger une playlist par genre
  const loadPlaylist = (genre: string) => {
    const playlist = musicLibrary[genre] || musicLibrary.random;
    setCurrentPlaylist([...playlist]);
    setCurrentTrackIndex(0);
    setSelectedGenre(genre);
    setIsPlaying(true);
    setIsShuffle(genre === 'random'); // Active le shuffle par défaut pour le genre "random"
    setView('player');
  };

  // Réinitialiser à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setView('genres');
      setSelectedGenre('random');
      setCurrentTrackIndex(0);
      setIsPlaying(true);
      setIsShuffle(false);
    }
  }, [isOpen]);

  const currentTrackUrl = currentPlaylist[currentTrackIndex] || '';

  // Extraire le titre depuis l'URL
  const getTrackTitle = (url: string) => {
    try {
      const path = new URL(url).pathname;
      const parts = path.split('/').filter(Boolean);
      const trackName = parts[parts.length - 1]?.replace(/-/g, ' ') || 'Titre inconnu';
      const artist = parts[parts.length - 2]?.replace(/-/g, ' ') || 'Artiste inconnu';
      return { title: capitalize(trackName), artist: capitalize(artist) };
    } catch {
      return { title: 'Titre inconnu', artist: 'Artiste inconnu' };
    }
  };

  const capitalize = (str: string) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  const embedUrl = currentTrackUrl
    ? `https://w.soundcloud.com/player/?url=${encodeURIComponent(currentTrackUrl)}&color=%2322d3ee&auto_play=${isPlaying}&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`
    : '';

  if (!isOpen) return null;

  // ========== VUE : Sélection des genres ==========
  if (view === 'genres') {
    const genres = [
      { key: 'random', label: 'Aléatoire', icon: <FaRandom />, color: 'from-purple-600 to-pink-600', hover: 'hover:from-purple-500 hover:to-pink-500' },
      { key: 'hardcore', label: 'Hardcore', icon: <FaHeadphones />, color: 'from-red-600 to-orange-600', hover: 'hover:from-red-500 hover:to-orange-500' },
      { key: 'techno', label: 'Techno', icon: <FaMusic />, color: 'from-blue-600 to-cyan-600', hover: 'hover:from-blue-500 hover:to-cyan-500' },
      { key: 'trance', label: 'Trance', icon: <FaMusic />, color: 'from-indigo-600 to-purple-600', hover: 'hover:from-indigo-500 hover:to-purple-500' },
      { key: 'ambient', label: 'Ambient', icon: <FaMusic />, color: 'from-teal-600 to-emerald-600', hover: 'hover:from-teal-500 hover:to-emerald-500' },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="w-full max-w-2xl bg-gray-900 border border-cyan-500 rounded-lg overflow-hidden shadow-2xl">
          <div className="bg-gray-800 px-4 py-3 flex justify-between items-center border-b border-gray-700">
            <h3 className="text-cyan-400 font-mono flex items-center gap-2">
              <FaMusic className="w-5 h-5" />
              Lecteur SoundCloud — Aincrad
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-gray-400 text-center mb-6">Choisis un style de musique :</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {genres.map((genre) => (
                <button
                  key={genre.key}
                  onClick={() => loadPlaylist(genre.key)}
                  className={`bg-gradient-to-r ${genre.color} ${genre.hover} text-white px-6 py-4 rounded-lg font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg`}
                >
                  <span className="text-xl">{genre.icon}</span>
                  <span>{genre.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 px-4 py-3 text-center text-xs text-gray-500 border-t border-gray-700">
            {musicLibrary.random.length} titres disponibles • Cliquez pour lancer la lecture
          </div>
        </div>
      </div>
    );
  }

  // ========== VUE : Lecteur ==========
  const { title, artist } = getTrackTitle(currentTrackUrl);
  const genreLabel = selectedGenre === 'random' ? 'Aléatoire' : 
                    selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl h-[75vh] bg-gray-900 border border-cyan-500 rounded-lg overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('genres')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
              title="Retour aux genres"
            >
              <FaArrowLeft className="w-4 h-4" />
            </button>
            <h3 className="text-cyan-400 font-mono text-sm">
              {genreLabel} • {currentTrackIndex + 1}/{currentPlaylist.length}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Infos du morceau */}
        <div className="px-4 py-3 bg-gray-850 text-center border-b border-gray-700">
          <div className="text-white font-medium truncate">{title}</div>
          <div className="text-gray-400 text-sm truncate">{artist}</div>
        </div>

        {/* Lecteur SoundCloud */}
        <div className="flex-1 p-2">
          {embedUrl ? (
            <iframe
              ref={iframeRef}
              key={currentTrackUrl}
              width="100%"
              height="100%"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={embedUrl}
              title="SoundCloud Player"
              className="rounded"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Chargement...
            </div>
          )}
        </div>

        {/* Contrôles */}
        <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-700">
          {/* Gauche : Shuffle */}
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`transition-colors ${isShuffle ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
            title="Mode aléatoire"
          >
            <FaRandom className="w-5 h-5" />
          </button>

          {/* Centre : Navigation & Play */}
          <div className="flex items-center gap-5">
            <button onClick={handlePrevTrack} className="text-cyan-400 hover:text-cyan-300 transition-colors" title="Précédent">
              <FaStepBackward className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="bg-cyan-600 hover:bg-cyan-500 w-11 h-11 rounded-full flex items-center justify-center text-black font-bold transition-colors shadow-lg"
              title={isPlaying ? 'Pause' : 'Lecture'}
            >
              {isPlaying ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-4 h-4 ml-0.5" />}
            </button>
            <button onClick={handleNextTrack} className="text-cyan-400 hover:text-cyan-300 transition-colors" title="Suivant">
              <FaStepForward className="w-5 h-5" />
            </button>
          </div>

          {/* Droite : Volume */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setVolume(v => v === 0 ? 80 : 0)} 
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
              title={volume === 0 ? 'Réactiver le son' : 'Couper le son'}
            >
              {volume === 0 ? <FaVolumeMute className="w-4 h-4" /> : volume < 50 ? <FaVolumeDown className="w-4 h-4" /> : <FaVolumeUp className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              title={`Volume: ${volume}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicModal;
