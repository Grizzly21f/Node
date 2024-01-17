import { Token } from "../models/token.model";
import { IToken } from "../interfaces/token.interface";

class TokenRepository {
    public async create(data: Partial<IToken>) {
        return await Token.create(data);
    }
}

export const tokenRepository = new TokenRepository();