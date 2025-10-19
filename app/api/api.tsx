"use server";
import { redirect } from "next/navigation";
import prisma from "../client";
import { revalidatePath } from "next/cache";

//Run on "Add Plant" Form Submission
export async function submitCreateForm(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const waterInterval = Number(formData.get('waterInterval'));
    const timeTillWater = (Number(formData.get('timeTillWater')) || waterInterval);
    //const plantedAt = formData.get('plantedAt') as new Date;
    const addPlant = await prisma.plant.create({
        data: {
            name,
            waterInterval,
            timeTillWater
        },
    });
    revalidatePath('/');
    redirect('/');
}

//Run on "Just Watered" button press
export async function markWatered(id: number, waterInterval: number) {
    'use server';
    const plant = await prisma.plant.update({
        where: { id: id },
        data: { timeTillWater: waterInterval }
        //GOT IT!
    });
    revalidatePath('/');
    redirect('/');
}

//Pulls all Plants (Display and DB Iteration)
export async function getPlants() {
    'use server';
    const plants = await prisma.plant.findMany();
    return plants;
}

//Runs on Delete Button Press in Garden
export async function deletePlant(id: number) {
    'use server';
    const delPlant = await prisma.plant.delete({
        where: { id: id },
    });
    revalidatePath('/');
    redirect('/');
}


