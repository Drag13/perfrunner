export const PArr = {
    init0: (length: number) => Array(length).fill(0),
    splitBy: <T>(arr: T[], min: number): T[][] => {

        const res = [];
        while (arr.length > 0) {
            res.push(arr.splice(0, min));
        }

        return res;
    }
};