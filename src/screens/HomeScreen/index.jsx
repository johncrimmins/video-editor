import React from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { BasicScreen } from '../../shared/layouts';
import { Card, CardContent } from '../../shared/ui/shadcn';

/**
 * HomeScreen - Modern version using BasicScreen template and shadcn/ui components
 * Provides landing screen with navigation and action cards
 */
const HomeScreen = () => {
  const { navigate } = useNavigation();
  
  const handleEditVideo = () => {
    navigate('editor');
  };
  
  const handleRecordDemo = () => {
    navigate('recordings');
  };
  
  return (
    <BasicScreen className="justify-center items-center p-xxxxl overflow-hidden">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-xl">
          <span className="text-6xl inline-block">🎬</span>
        </div>
        
        <h1 className="text-5xl font-semibold text-text mb-xxxxl tracking-tight">
          What do you want to do?
        </h1>
        
        <div className="flex gap-xl justify-center flex-wrap">
          <Card 
            variant="card" 
            className="flex items-center gap-lg p-xxl cursor-pointer transition-all duration-200 ease-in-out min-w-80 text-left hover:bg-card-hover hover:border-primary border-2"
            onClick={handleEditVideo}
          >
            <div className="text-5xl flex-shrink-0">✂️</div>
            <CardContent className="flex-1 p-0">
              <div className="text-xl font-semibold text-text mb-xs">
                Edit a video
              </div>
              <div className="text-sm text-text-secondary leading-relaxed">
                Import and edit your video clips
              </div>
            </CardContent>
          </Card>
          
          <Card 
            variant="card" 
            className="flex items-center gap-lg p-xxl cursor-pointer transition-all duration-200 ease-in-out min-w-80 text-left hover:bg-card-hover hover:border-primary border-2"
            onClick={handleRecordDemo}
          >
            <div className="text-5xl flex-shrink-0">🎥</div>
            <CardContent className="flex-1 p-0">
              <div className="text-xl font-semibold text-text mb-xs">
                Record a quick demo
              </div>
              <div className="text-sm text-text-secondary leading-relaxed">
                Capture your screen and create a demo
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BasicScreen>
  );
};

export default HomeScreen;
