/* ── Config ── all user-tuneable constants, derived once at startup */
export const CFG    = window.DiviConfig || {};
export const NAME   = CFG.name || 'Divi';
export const TRAITS = (CFG.personality && CFG.personality.traits) || {};
export const PMODE  = (typeof CFG.personality === 'string') ? CFG.personality
                 : (CFG.personality && CFG.personality.mode) || 'guide';
export const BUBBLE_P  = TRAITS.bubbliness != null ? TRAITS.bubbliness
                  : ({ guide:.34, sales:.52, assistant:.2, companion:.44, mascot:.4 }[PMODE] || .36);
export const EXCITE_D  = 120 + (TRAITS.salesAggression || 0);
export const HAPPY_D   = EXCITE_D * 2.4;
export const IDLE_ANIM = CFG.personality && CFG.personality.idleAnimations === false ? false : true;
export const PET_REACT = CFG.personality && CFG.personality.petResponsive  === false ? false : true;
export const VOICE_EN  = !!(CFG.personality && CFG.personality.voiceEnabled);
