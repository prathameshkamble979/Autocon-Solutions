import React from 'react';
import { tenant } from '../config';

const GoogleMap = () => {    return (
        <div className="w-full h-full min-h-[400px] bg-slate-200 rounded-2xl overflow-hidden shadow-inner relative">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.5761096749845!2d73.83296031481198!3d18.457542987446555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2956de1555555%3A0x6e8e583c27184282!2sD%20M%20Tech%20Solutions!5e0!3m2!1sen!2sin!4v1677654321098!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${tenant.name} Location`}
                className="absolute inset-0 w-full h-full"
            ></iframe>

            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg text-xs z-10 hidden sm:block">
                <p className="font-bold text-slate-900">{tenant.name}</p>
                <p className="text-slate-600">{tenant.contactInfo?.address || 'Pune, Maharashtra'}</p>
                <a
                    href="https://goo.gl/maps/BestKeyHere"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-bold mt-1 block"
                >
                    View Larger Map
                </a>
            </div>
        </div>
    );
};

export default GoogleMap;
