import React, { Component } from 'react';
import Lottie from 'react-lottie-player';

class LottieAudioVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lottieOptions: {
                loop: true,
                autoplay: true,
                animationData: null, // Initially, there's no animation data
            },
            frame: 0,
        };
    }

    componentDidMount() {
        fetch('https://lottie.host/3c9a98d3-69be-4d29-9010-4f9f539833da/UpNgUAXTRG.json')
            .then(res => res.json())
            .then(data => {
                this.setState({
                    lottieOptions: { ...this.state.lottieOptions, animationData: data }
                });
            })
            .catch(error => console.error('Error loading Lottie animation:', error));
    }

    componentDidUpdate(prevProps) {
        if (this.props.audioData !== prevProps.audioData) {
            this.updateFrame();
        }
    }

    updateFrame() {
      if (!this.props.audioData || !this.state.lottieOptions.animationData) return;
  
      // Calculate RMS (Root Mean Square) to get a better measure of volume
      const rms = Math.sqrt(this.props.audioData.reduce((sum, x) => sum + x * x, 0) / this.props.audioData.length);
      const maxRMS = 128;  // Assuming the RMS can go up to 128
      const frameIndex = Math.floor((rms / maxRMS) * this.state.lottieOptions.animationData.op);  // op is the total frame number
  
      console.log(`Volume: ${rms}, Frame: ${frameIndex}`);  // Log the calculated frame index based on volume
  
      this.setState({ frame: frameIndex });
  }
  

  render() {
    if (!this.state.lottieOptions.animationData) {
        return <div>Loading animation...</div>;
    }

    return (
      <Lottie
          play
          animationData={this.state.lottieOptions.animationData}
          goTo={this.state.frame}
          style={{ width: 300, height: 300 }}
      />
  );
}
}

export default LottieAudioVisualizer;
