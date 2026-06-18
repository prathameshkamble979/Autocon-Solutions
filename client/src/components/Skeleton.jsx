
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonLoader = ({ count = 1, height, width, circle, className }) => {
    return (
        <Skeleton
            count={count}
            height={height}
            width={width}
            circle={circle}
            className={className}
            baseColor="#f1f5f9" // Slate-100
            highlightColor="#e2e8f0" // Slate-200
        />
    );
};

export default SkeletonLoader;
