import {starList, type StarListType, starMap, type StarType} from "./StarList.ts"
import {Star} from "./Star.tsx";
import {ConstellationLines} from "./ConstellationLines.tsx";
import {useMemo} from "react";
import {ShootingStars} from "./ShootingStars.tsx";
import {Stars as StarField} from "@react-three/drei"

export interface StarsProps {
    // position: [number, number, number]
    positionY: number;
    offsets: [number, number, number]
}


const WORLD_LOWER_BOUND_X = -600
const WORLD_UPPER_BOUND_X = 700
const WORLD_LOWER_BOUND_Y = -300
const WORLD_UPPER_BOUND_Y = 350

const ORIGINAL_X_SCALE = 230;
const ORIGINAL_Y_SCALE = 170;

const yWorldAxis: number = WORLD_UPPER_BOUND_Y - WORLD_LOWER_BOUND_Y;
const xWorldAxis: number = WORLD_UPPER_BOUND_X - WORLD_LOWER_BOUND_X;

const yFactor: number = yWorldAxis / ORIGINAL_Y_SCALE;
const xFactor: number = xWorldAxis / ORIGINAL_X_SCALE;

// Assumes x and y are 0 indexed and start
// from top left (no negative numbers) like
// most images have pixels scaled.
const ScaleCoords = (x: number, y: number): [number, number] => {

    const adjustedY: number = WORLD_UPPER_BOUND_Y - (y * yFactor);
    const adjustedX: number = WORLD_LOWER_BOUND_X + (x * xFactor);
    return [adjustedX, adjustedY];
}


export const Stars = ({
                          positionY,
                          offsets
                      }: StarsProps) => {
    const adjustedStarList: StarListType = useMemo(() => {
        const tempStarList = JSON.parse(JSON.stringify(starList));
        for (const [key, starr] of Object.entries(tempStarList)) {
            const adjustedxz = ScaleCoords(starr.x, starr.y)
            tempStarList[key].x = adjustedxz[0] + offsets[0]
            tempStarList[key].y = adjustedxz[1] + offsets[2]
        }
        return tempStarList
    }, [starList, ORIGINAL_X_SCALE, ORIGINAL_Y_SCALE, yWorldAxis, xWorldAxis]);
    const extraStars = useMemo(() => {
        const extraStarList = []
        for (let i = 0; i < 40; i++) {
            extraStarList.push(
                [
                    Math.random() * xWorldAxis + WORLD_LOWER_BOUND_X, //x component
                    Math.random() * yWorldAxis + WORLD_LOWER_BOUND_Y, //z component
                ]
            )
        }
        return extraStarList
    }, [])
    return (
        <>
            {
                Object.entries(adjustedStarList).map(([key, starr]) => {
                    // const adjustedXZ = ScaleCoords(starr.x, starr.y)
                    // YEs I know it says xz while the coordinates say xy. The
                    // program is actually looking up so the plane is xz, not xy.
                    // Apologies to future keane/maintainers.
                    return (
                        <Star
                            key={key}
                            position={
                                [
                                    starr.x,
                                    positionY + offsets[1],
                                    starr.y

                                ]
                            }
                        />
                    )
                })

            }
            {/*{*/}
            {/*    extraStars.map(([x, y], index) => {*/}
            {/*        return (*/}
            {/*            <Star*/}
            {/*                key={String(index) + x + y}*/}
            {/*                size={0.5}*/}
            {/*                position={[*/}
            {/*                    x,*/}
            {/*                    positionY,*/}
            {/*                    y*/}
            {/*                ]}*/}
            {/*            />*/}
            {/*        )*/}
            {/*    })*/}
            {/*}*/}
            <ConstellationLines
                positionY={positionY}
                adjustedStarList={adjustedStarList}
            />
            <ShootingStars
                count={10}
                areas={[
                    [900, 500, 500],
                    [-250, 600, -250],
                    [-900, 700, -1000],
                    // this last part is extreme to let the
                    // stars move far out of the way, so when
                    // they 'snap' back to the start, it isnt visible
                    [3000, 900, -1500],
                ]}
                variance={300}
                baseSpeed={0.1}
                speedVariance={0.05}
                delayVariance={7}
            />
            <StarField radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1}/>

        </>
    )
}