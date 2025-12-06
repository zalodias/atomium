export const colors = {
  transparent: "transparent",
  background: {
    neutral: {
      default: "hsl(0, 0%, 96%)",
      strong: "hsl(0, 0%, 80%)",
      subtle: "hsl(0, 0%, 88%)",
      faded: "hsl(0, 0%, 92%)",
      inverse: "hsl(0, 0%, 4%)",
    },
    brand: {
      subtle: "hsl(185, 96%, 64%)",
      strong: "hsl(205, 96%, 56%)"
    },
  },
  foreground: {
    neutral: {
      default: "hsl(0, 0%, 4%)",
      strong: "hsl(0, 0%, 12%)",
      subtle: "hsl(0, 0%, 24%)",
      faded: "hsl(0, 0%, 48%)",
      inverse: "hsl(0, 0%, 96%)",
    },
    brand: {
      default: "hsl(195, 96%, 48%)",
    }
  },
  border: {
    neutral: {
      default: "hsl(0, 0%, 80%)",
      strong: "hsl(0, 0%, 64%)",
      subtle: "hsl(0, 0%, 88%)",
      faded: "hsl(0, 0%, 92%)",
      inverse: "hsl(0, 0%, 4%)",
    },
  },
  shadow: {
    neutral: {
      default: "hsla(0, 0%, 0%, 0.2)",
    }
  }
};

export const typography = {
  body: {
    small: { fontSize: 12, lineHeight: 18, letterSpacing: -0.2 },
    medium: { fontSize: 14, lineHeight: 22, letterSpacing: -0.2 },
    large: { fontSize: 16, lineHeight: 26, letterSpacing: -0.2 },
  },
  title: {
    small: { fontSize: 18, lineHeight: 28, letterSpacing: -0.4 },
    medium: { fontSize: 20, lineHeight: 30, letterSpacing: -0.4 },
    large: { fontSize: 24, lineHeight: 32, letterSpacing: -0.4 },
  },
  display: {
    small: { fontSize: 32, lineHeight: 40, letterSpacing: -0.8 },
    medium: { fontSize: 40, lineHeight: 48, letterSpacing: -0.8 },
    large: { fontSize: 48, lineHeight: 56, letterSpacing: -0.8 },
  },
};
