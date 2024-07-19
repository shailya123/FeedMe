'use client'
import { useEffect, useState } from "react";
type props = {
    averageRating: number;
    totalRatings: number;
    ratingsDistribution: any
}
const RatingComponent = ({ averageRating, totalRatings, ratingsDistribution }: props) => {
    const [ratingsDistributionEmpty, setRatingsDistributionEmpty] = useState(false);
    const ratedDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const ratingColorScheme: { [key: number]: { color: string, ratedCategory: string } } = { 1: { color: 'bg-[#ff4545]', ratedCategory: 'Very Bad' }, 2: { color: 'bg-[#ffa534]', ratedCategory: 'Bad' }, 3: { color: 'bg-[#ffe234]', ratedCategory: 'Average' }, 4: { color: 'bg-[#b7dd29]', ratedCategory: 'Excellent' }, 5: { color: 'bg-[#57e32c]', ratedCategory: 'Outstanding' } }
    const averageRatingColor = ratingColorScheme[Math.floor(averageRating)];

    useEffect(() => {
        (JSON.stringify(ratingsDistribution) === JSON.stringify(ratedDist) || Object.keys(ratingsDistribution).length === 0) ?
            setRatingsDistributionEmpty(true) :
            setRatingsDistributionEmpty(false);
    }, [ratingsDistribution, averageRating, totalRatings])

    return (
        <div className="bg-foreground p-6 rounded-lg shadow-lg w-[36rem] flex justify-evenly gap-4">
            <div className="flex flex-col items-center gap-3 justify-center">
                <div className={`${averageRatingColor?.color ?? 'bg-green-500'} text-white text-3xl font-bold p-4 rounded-full`} >
                    {averageRating}
                </div>
                <div className='text-sm flex-col flex items-center'>
                    <p className="text-gray-600 font-semibold">{averageRatingColor?.ratedCategory ?? 'No'} Rating</p>
                    <p className="text-gray-600">Based on {totalRatings?.toLocaleString()} ratings</p>
                </div>
            </div>
            <div className="space-y-2">
                {Object.keys(ratingsDistribution).reverse().map((key) => (
                    <div key={key} className="flex items-center">
                        <span className="w-16 text-gray-600">{key} star</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-4 w-36 overflow-hidden mx-2">
                            <div
                                className={`${ratingsDistributionEmpty ? '' : 'bg-yellow-400'} h-full`}
                                style={{ width: `${(ratingsDistribution[key] / totalRatings) * 100}%` }}
                            ></div>
                        </div>
                        <span className="w-12 text-right text-gray-600">{ratingsDistribution[key]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingComponent;
