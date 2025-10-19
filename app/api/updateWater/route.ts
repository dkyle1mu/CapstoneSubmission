import { NextResponse } from 'next/server'
import prisma from '@/app/client'

type Plant = { id: number, name: string, waterInterval: number, timeTillWater: number };

//Waits for Request from Firebase
export async function POST(request: Request) {
  try {
    const dryPlants: string[] = []
    const plants = await prisma.plant.findMany()

    const updatedPlants = plants.map(async (plant: Plant) => {
      let newTimeTillWater = plant.timeTillWater - .1
      if (newTimeTillWater === 0) {
        //Adds Plant Names that Need Watering
        dryPlants.push(plant.name)
      }
      if (newTimeTillWater < 0) newTimeTillWater = 0
      return prisma.plant.update({
        where: { id: plant.id },
        data: { timeTillWater: newTimeTillWater },
      })
    })

    await Promise.all(updatedPlants)

    if (dryPlants.length > 0) {
      //Returns Array of Dry Plants for Notification with Status 200
      return NextResponse.json(dryPlants, { status: 200 })
    }
    //Returns 204 Indicating Succes with No Content
    console.log("No plants need watering at this time. But I did check. For you. You're welcome.")
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('updateWater error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
