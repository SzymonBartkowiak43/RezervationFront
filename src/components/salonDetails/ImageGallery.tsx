import React, { useState, useEffect } from "react";
import { getSalonImage } from "../../Services/salonService";
import "./ImageGallery.css";

interface ImageDto {
    id: number;
    name: string;
    imageUrl: string;
    imageId: string;
    salonId: number;
}

interface ImageGalleryProps {
    salonId: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ salonId }) => {
    const [images, setImages] = useState<ImageDto[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await getSalonImage(salonId);
                if (response.status === 200 && response.data.length > 0) {
                    setImages(response.data);
                } else {
                    setImages([]);
                }
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [salonId]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (loading) return <div>Loading images...</div>;
    if (images.length === 0) return <div>No images available</div>;

    return (
        <div className="image-gallery">
            <button className="gallery-btn prev-btn" onClick={handlePrev}>
                &lt;
            </button>
            <img
                src={images[currentIndex].imageUrl}
                alt={`${images[currentIndex].name} - ${currentIndex + 1}`}
                className="gallery-image"
            />
            <button className="gallery-btn next-btn" onClick={handleNext}>
                &gt;
            </button>
        </div>
    );
};

export default ImageGallery;
