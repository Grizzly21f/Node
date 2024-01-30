import { tokensRemover } from "./remove-old-tokens.cron";
import {tokensValidation} from "./token-validation-cron";

export const runAllCronJobs = () => {
    tokensRemover.start();
    tokensValidation.start();
};
