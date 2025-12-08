import * as React from "react";
import { View, StyleSheet, Animated, TextInput, Text } from "react-native";
import Svg, {G, Circle, Circle as SvgCircle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedInput = Animated.createAnimatedComponent(TextInput);

export default function BudgetBreakdown({
    percentage = 70,
    radius = 45, 
    strokeWidth = 10,
    color='tomato',
    duration = 500,
    textColor = 'tomato',
    delay = 0,
    max = 100,
}) {

    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const halfCircle = radius + strokeWidth;
    const circleCircumference = 2 * Math.PI * radius;
    const circleRef = React.useRef<SvgCircle>(null);
    const inputRef = React.useRef<TextInput>(null);
    const animation = (toValue: any) => {
        return Animated.timing(animatedValue, {
            toValue,
            duration,
            delay,
            useNativeDriver: true,
        }).start();

    }
    
    React.useEffect(() => {
        animation(percentage);

        animatedValue.addListener(v => {
            if (circleRef?.current) {
                const maxPercentage = (100 * v.value) / max;
                const strokeDashoffset = 
                    circleCircumference - (circleCircumference * percentage) / 100;
                circleRef.current.setNativeProps({
                    strokeDashoffset,
                });
            }

            if (inputRef?.current) {
                inputRef.current.setNativeProps({
                    text: `${Math.round(v.value)}%`
                })
                
            }
        });

        return () => {
            animatedValue.removeAllListeners();
        }
    }, [max, percentage]);
  return (
    <View style={styles.container}>
            <Text style={{ 
                color: "tomato",
                fontWeight: "900",
                alignItems: "center",
                marginLeft: 28,
                }}>
                Spent:
            </Text>
  
        <Svg
        width={(halfCircle * 2) + strokeWidth}
        height={halfCircle * 2}
        viewBox={`0 0 ${(halfCircle * 2) + strokeWidth} ${halfCircle * 2}`}
        >
        <G transform={`translate(${strokeWidth / 2} 0) rotate(-90 ${halfCircle} ${halfCircle})`}>
                <Circle
                    cx="50%"
                    cy="50%"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    r={radius}
                    strokeOpacity = {0.2}
                    fill="transparent"
                >
                </Circle>
                <AnimatedCircle
                    ref={circleRef}
                    cx="50%"
                    cy="50%"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    r={radius}
                    fill="transparent"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={circleCircumference}
                    strokeLinecap="round"
                >
                </AnimatedCircle>
            </G>
        </Svg>
        <AnimatedInput
            ref={inputRef}
            underlineColorAndroid={"transparent"}
            editable={false}
            defaultValue="0"
            style={[
                StyleSheet.absoluteFillObject,
                { fontSize: radius / 2, color: textColor ?? color },
                { fontWeight: '900', textAlign: 'center'}
            ]}
        >
        </AnimatedInput>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    }

});