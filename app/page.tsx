"use client";
import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { markWatered, getPlants, deletePlant } from './api/api';

type Plant = { id: number, name: string, waterInterval: number, timeTillWater: number };

function confirmDelete(id: number, name: string) {
    return (
        <div className='block'>
            <h1>Are you sure you want to delete {name}?</h1>
            <button type="submit" onClick={() => void deletePlant(id)}>Delete Plant</button>
        </div>
    )
}

function PlantCard(plant: Plant) {
   
    return(
        <div className="m-4 p-4 border-1 border-emerald-600 bg-amber-100 rounded-lg">
            <h6 className="-mt-4 text-right"><button type = "button" onClick={() => deletePlant(plant.id)} >x</button></h6> {/* ###Does not function */}
            <h2 className="text-2xl -mt-1">{plant.name}</h2>
            <progress value={plant.waterInterval - plant.timeTillWater} max={plant.waterInterval} className="w-full h-4 mt-2 mb-2"></progress>
            <p><b>{plant.timeTillWater}</b> hours until next watering.</p>
            <button type = "button" onClick={() => void markWatered(plant.id, plant.waterInterval)} className="mt-2 p-2 bg-amber-300 rounded-lg hover:bg-amber-500">Just Watered</button>
            {/****Possible Feature: Enter Last Watering Time */}
        </div>
    )
}

export default function Page() {
    const [plants, setPlants] = useState<Plant[]>([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getPlants();
                if (mounted) setPlants(data);
            } catch (e) {
                console.error(e);
            }
        })();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
      if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => registration.pushManager.subscribe({userVisibleOnly: true}))
      .then(() => { console.log('Mini Garden Helper Registered!')});
      }},[]);

    return(

    <div>
        <h1 className = "text-6xl text-center mt-8 ">Garden</h1>
        <div className="mt-3 grid grid-cols-3">
            {plants.map(plant =>
                <PlantCard key={plant.id} id={plant.id} name={plant.name} waterInterval={plant.waterInterval} timeTillWater={plant.timeTillWater} />
            )}
        </div>
        <div className='mt-10 text-center'>
        <button onClick={() => redirect("/createplant")}className = 'bg-amber-300 rounded-3xl pt-1 pb-1 hover:bg-amber-500 p-10 scale-150 mx-auto text-center'>Add New Plant</button>
        </div>
    </div>
)


}