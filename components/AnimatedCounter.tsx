//had to do this because getting useRef only works in client components error
//external packages use client side packages sometimes
//hence why we create a new component to use CountUp

"use client"; //telling next js to create a boundary to package this component and its dependencies for the browser

import CountUp from "react-countup";

const AnimatedCounter =  ({ amount }: { amount: number }) => {
    return (
        <div className="w-full">
            <CountUp
              duration={1.75}  
              decimals={2} 
              decimal= ","
              prefix="$"
              end={amount} />
        </div>
    )
}

export default AnimatedCounter