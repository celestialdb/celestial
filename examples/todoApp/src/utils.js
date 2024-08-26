import {testSlice} from "./dataApi/dataApi";
testSlice.actions = {
    'statusFilterChanged': (state, action) => {
        console.log("---- new reducer called: ", action)
        state.status = action.payload
    },
    'colorFilterChanged': (state, action, color, changeType) => {
        console.log("---- new reducer called: ", color, changeType)
        const {colors} = state
        switch (changeType) {
            case 'added': {
                if (!colors.includes(color)) {
                    colors.push(color)
                }
                break
            }
            case 'removed': {
                state.colors = colors.filter(
                    (existingColor) => existingColor !== color
                )
            }
            default:
                return
        }
    }
}

export const { colorFilterChanged, statusFilterChanged } = testSlice.actions