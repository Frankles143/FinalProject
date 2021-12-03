import * as Colours from './colours';

export const fontSize = {
    smallest: {
        fontSize: 13,
    },
    small: {
        fontSize: 14,
    },
    medium: {
        fontSize: 16,
    },
    large: {
        fontSize: 19,
    },
    largest: {
        fontSize: 24,
    }
}

export const lineHeight = {
    smallest: {
        fontSize: 20,
    },
    small: {
        fontSize: 22,
    },
    medium: {
        fontSize: 24,
    },
    large: {
        fontSize: 26,
    },
    largest: {
        fontSize: 32,
    }
}

export const header = {
    smallest: {
        ...fontSize.smallest,
        ...lineHeight.smallest,
        fontWeight: "bold"
    },
    small: {
        ...fontSize.small,
        ...lineHeight.small,
        fontWeight: "bold"
    },
    medium: {
        ...fontSize.medium,
        ...lineHeight.medium,
        fontWeight: "bold"
    },
    large: {
        ...fontSize.large,
        ...lineHeight.large,
        fontWeight: "bold"
    },
    largest: {
        ...fontSize.largest,
        ...lineHeight.largest,
        fontWeight: "bold"
    }
}

export const body = {
    smallest: {
        ...fontSize.smallest,
        ...lineHeight.smallest,
        ...Colours.neutral.grey10,
        fontWeight: "normal"
    },
    small: {
        ...fontSize.small,
        ...lineHeight.small,
        ...Colours.neutral.grey10,
        fontWeight: "normal"
    },
    medium: {
        ...fontSize.medium,
        ...lineHeight.medium,
        ...Colours.neutral.grey10,
        fontWeight: "normal"
    },
    large: {
        ...fontSize.large,
        ...lineHeight.large,
        ...Colours.neutral.grey10,
        fontWeight: "normal"
    },
    largest: {
        ...fontSize.largest,
        ...lineHeight.largest,
        ...Colours.neutral.grey10,
        fontWeight: "normal"
    },
}