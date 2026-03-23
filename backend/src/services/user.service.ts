import { UserRepository } from '../repositories/user.repo.js';

export class UserService {
    static getOrCreate(userData: { username: string, name: string, age: number, weight: number, height: number }) {
        const existing = UserRepository.findByUsername(userData.username);
        if (existing) {
            return { user: existing, isNew: false };
        }

        const newId = UserRepository.create(userData);
        const newUser = UserRepository.findByUsername(userData.username);
        return { user: newUser, isNew: true };
    }
}
