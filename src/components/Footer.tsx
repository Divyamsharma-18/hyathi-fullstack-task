
import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer text-center py-4">
      <div className="container mx-auto">
        <p className="text-blue-300 text-sm">
          Made with <Heart className="heart-icon inline-block" size={16} /> by Divyam Sharma
        </p>
      </div>
    </footer>
  );
};

export default Footer;
