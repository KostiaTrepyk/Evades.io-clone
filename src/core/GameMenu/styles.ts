import type { HSLA } from '@utils/hsla';

const rootContainerStyles: Partial<CSSStyleDeclaration> = {
  // To show the menu, change 'none' to 'flex'
  display: 'none',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  backgroundColor: 'rgba(38, 38, 38, 1)',
};

const containerStyles: Partial<CSSStyleDeclaration> = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: '40px 30px',
  borderRadius: '10px',
  background: "filter: 'blur(20px)'",
};

const menuTitleStyles: Partial<CSSStyleDeclaration> = {
  fontSize: '28px',
  color: '#fff',
  textAlign: 'center',
  // For better text visibility
  textShadow: '1px 1px 3px rgba(104, 104, 104, 1)',
};

const heroContainerStyles: Partial<CSSStyleDeclaration> = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '20px',
  marginTop: '20px',
};

const heroButtonStyles: (heroColor: HSLA) => Partial<CSSStyleDeclaration> = (heroColor: HSLA) => ({
  padding: '15px 20px',
  fontSize: '18px',
  cursor: 'pointer',
  backgroundColor: heroColor.toString(),
  border: 'none',
  borderRadius: '5px',
  color: '#fff',
  height: '55px',
  width: '110px',
  textAlign: 'center',
  overflow: 'hidden',
  // For better text visibility
  textShadow: '1px 1px 2px rgba(0, 0, 0, 1)',
});

export {
  rootContainerStyles,
  containerStyles,
  menuTitleStyles,
  heroContainerStyles,
  heroButtonStyles,
};
