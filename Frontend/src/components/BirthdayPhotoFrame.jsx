import React from 'react';

const BirthdayPhotoFrame = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-50">
      <div className="relative max-w-[90vw] p-5">
        {/* Outer decorative frame */}
        <div className="relative p-8 rounded-lg"
          style={{
            background: 'linear-gradient(45deg, #ff6b6b, #ff9999)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
          
          {/* Birthday text banner */}

          {/* Main frame container */}
          <div className="relative">
            {/* Decorative pattern border */}
            <div className="absolute inset-0 p-4"
              style={{
                background: `
                  repeating-linear-gradient(45deg,
                    #ffd700 0px,
                    #ffd700 10px,
                    #ff69b4 10px,
                    #ff69b4 20px
                  )
                `,
                padding: '12px',
                borderRadius: '8px'
              }}>
              
              {/* Inner white frame */}
              <div className="relative bg-white p-3 rounded-lg shadow-inner"
                style={{
                  border: '8px solid white',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
                }}>
                
                {/* Image container */}
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src="/saiteja.png"
                    alt="Birthday photo"
                    className="block mx-auto"
                    style={{
                      width: '100%',
                      maxWidth: '300px',
                      height: 'auto',
                      maxHeight: '250px',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Birthday decorations */}
            {/* Balloons */}
            <div className="absolute w-full h-full pointer-events-none">
              {[
                { top: '-30px', left: '5%', bg: '#ff69b4' },
                { top: '-40px', left: '25%', bg: '#ffd700' },
                { top: '-30px', right: '25%', bg: '#87ceeb' },
                { top: '-40px', right: '5%', bg: '#98fb98' }
              ].map((balloon, index) => (
                <div
                  key={`balloon-${index}`}
                  className="absolute w-8 h-10 rounded-full"
                  style={{
                    top: balloon.top,
                    left: balloon.left,
                    right: balloon.right,
                    background: balloon.bg,
                    transform: 'translateY(0)',
                    animation: 'float 2s ease-in-out infinite alternate'
                  }}
                >
                  <div 
                    className="absolute bottom-[-10px] left-1/2 w-1 h-5 bg-white"
                    style={{ transform: 'translateX(-50%)' }}
                  />
                </div>
              ))}
            </div>

            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-6 py-2 rounded-full z-10 whitespace-nowrap"
            style={{
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: '2px dashed #fff'
            }}>
            <span className="text-xl font-bold text-pink-600">🎈Happy Birthday spectra co-host!🎂 🎈</span>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayPhotoFrame;