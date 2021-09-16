import { Injectable } from '@nestjs/common';
import { Task } from 'src/entity/task.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class TaskService {

    async create(task: Task) {
        try{
            const taskRepository = getRepository(Task);
            await taskRepository.save(task);
        }
        catch(err){
            return {
                status: 'error',
                message: err.message,
                localisation: 'CREATE_TASK_ERROR'
            }
        }      
    }

    async delete(taskId: number) {
        try{
            const taskRepository = getRepository(Task);
            await taskRepository.delete(taskId);
        }
        catch(err){
            return {
                status: 'error',
                message: err.message,
                localisation: 'DELETE_TASK_ERROR'
            }
        }      
    }

    async update(task: Task) {
        try{
            const taskRepository = getRepository(Task);
            await taskRepository.update(task.id, task);
        }
        catch(err){
            return {
                status: 'error',
                message: err.message,
                localisation: 'UPDATE_TASK_ERROR'
            }
        }      
    }

    async getOne(taskId: number) {
        try{
            const taskRepository = getRepository(Task);
            const task = await taskRepository.findOne(
                taskId,
                {
                    relations: ["user"]
                }
            );
            return task;
        }
        catch(err){
            return {
                status: 'error',
                message: err.message,
                localisation: 'FIND_TASK_BY_ID_ERROR'
            }
        }      
    }

    async getAll() {
        try{
            const taskRepository = getRepository(Task);
            const task = await taskRepository.find({
                relations: ["user"]
            });
            return task;
        }
        catch(err){
            return {
                status: 'error',
                message: err.message,
                localisation: 'FIND_ALL_TASK_ERROR'
            }
        }      
    }
}
