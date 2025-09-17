import React, { useState } from 'react';
import { Steps } from 'antd';

const ProcessSteps: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const onChange = (value: number) => {
    console.log('onChange:', value);
    setCurrent(value);
  };

  const stepsData = [
    {
      title: 'Apply For Microfinance',
      description: 'Submit your application online or at our office to get started.',
    },
    {
      title: 'Application Review',
      description: 'Our team reviews your request quickly and transparently.',
    },
    {
      title: 'Visit Our Office',
      description: 'Complete the process with a quick visit to our office.',
    },
    {
      title: 'Get Your Dream Item',
      description: 'Walk away with your chosen item—paid in easy monthly installments.',
    },
  ];

  const customStepsStyle: React.CSSProperties = {
    '--ant-primary-color': '#5ba44c',
    '--ant-primary-color-hover': '#4a8c3f',
  } as React.CSSProperties;

  return (
    <div className="process-steps-container" style={{ padding: '2rem 0' }}>
      <style jsx global>{`
        .ant-steps .ant-steps-item-finish .ant-steps-item-icon {
          background-color: #5ba44c !important;
          border-color: #5ba44c !important;
        }
        
        .ant-steps .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
          color: white !important;
        }
        
        .ant-steps .ant-steps-item-active .ant-steps-item-icon {
          background-color: #5ba44c !important;
          border-color: #5ba44c !important;
        }
        
        .ant-steps .ant-steps-item-active .ant-steps-item-icon > .ant-steps-icon {
          color: white !important;
        }
        
        .ant-steps .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-tail::after {
          background-color: #5ba44c !important;
        }
        
        .ant-steps .ant-steps-item-title {
          color: #1a2844 !important;
          font-weight: 600 !important;
          font-size: 1.3rem !important;
        }
        
        .ant-steps .ant-steps-item-description {
          color: #666 !important;
          font-size: 0.95rem !important;
        }
        
        .ant-steps-vertical .ant-steps-item-content {
          min-height: 80px !important;
        }
        
        .ant-steps-item-icon {
          width: 50px !important;
          height: 50px !important;
          line-height: 50px !important;
          font-size: 1.2rem !important;
          font-weight: bold !important;
        }
      `}</style>
      
      {/* Horizontal Steps for larger screens */}
      <div className="hidden md:block">
        <Steps
          current={current}
          onChange={onChange}
          items={stepsData}
          style={customStepsStyle}
        />
      </div>

      {/* Vertical Steps for mobile screens */}
      <div className="block md:hidden">
        <Steps
          current={current}
          onChange={onChange}
          direction="vertical"
          items={stepsData}
          style={customStepsStyle}
        />
      </div>
    </div>
  );
};

export default ProcessSteps;
