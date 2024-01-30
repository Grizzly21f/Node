import {CronJob} from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {userRepository} from "../repositories/user.repository";
import {tokenRepository} from "../repositories/token.repository";
import {emailService} from "../services/email.service";
import {EEmailAction} from "../enums/email-action.enum";
import {ApiError} from "../../../Weather/src/errors/api.error";



dayjs.extend(utc);

const tokenValidation = async function () {
    try {

        const users = await userRepository.getAll();
        console.log('cron is work')

        await Promise.all(
            users.map(async (user)=>{

                const entity = await tokenRepository.getOneBy({_userId:user._id});
                if(!entity){
                    await emailService.sendMail(user.email,EEmailAction.TOKEN_VALIDATION,{name:user.name})
                }
            })
        )

    } catch (e) {
        throw  new ApiError(e.message,500)
    }
};


export const tokensValidation = new CronJob("* * * * *", tokenValidation);
