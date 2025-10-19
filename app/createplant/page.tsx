import Form from 'next/form'
import { submitCreateForm } from '../api/api'
let formField: string = "block rounded-md bg-white/5 px-3.5 py-2 outline-2 -outline-offset-1 outline-amber-300 focus:outline-2 focus:-outline-offset-2 focus:outline-amber-500"



export default function Page() {
    
    return (
        <div className='mt-20 mx-auto max-w-xl bg-amber-100 rounded-3xl'>
            <h1 className='pt-6 text-4xl text-center'>Add New Plant:</h1>
                <Form action={submitCreateForm} className='mt-16 grid grid-cols-1 gap-8 mx-auto max-w-md pb-6'>
                    <label> Plant Name: <input name = "name" type = "text" required = {true} autoFocus = {true} className = {formField}/> </label>
                    <label> Watering Interval: <input name = "waterInterval" type = "number" defaultValue = {48}  className = {formField}/> </label>
                    <label> Time Until Next Watering: <input name = "timeTillWater" type = "number" className = {formField}/> </label>
                    {/* ###plantedAt currently not supported in DB, fix after Capstone submission, currently hidden */}
                    <label hidden = {true} > Date Planted: <input name = "plantedAt" type="dateTime-local" className = {formField}></input></label>
                    <button className = 'bg-amber-300 rounded-3xl max-w-l pt-1 pb-1 hover:bg-amber-500' type = "submit">Add Plant to Garden</button>
                </Form>
        </div>
        
    )
}