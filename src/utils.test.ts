// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import {
    createGuid,
    calculateModalPosition,
    getAdaptiveSize,
    getAdaptiveSizeNumber,
    generateSearchParams
} from '@/utils/utils'

declare global {
    interface Window {
        webConfig: {
            screenWidth: number
        }
    }
}

const setViewport = (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        writable: true,
        value: width
    })
    Object.defineProperty(window, 'innerHeight', {
        configurable: true,
        writable: true,
        value: height
    })
}

describe('utils.ts', () => {
    beforeEach(() => {
        setViewport(500, 300)
        document.documentElement.style.fontSize = '16px'
        window.webConfig = { screenWidth: 1920 }
    })

    describe('createGuid', () => {
        it('should generate a guid-like string with expected hex segment lengths', () => {
            const guid = createGuid()
            expect(guid).toMatch(/^[0-9a-f]{12}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}$/)
        })

        it('should generate different values across consecutive calls (edge case)', () => {
            const a = createGuid()
            const b = createGuid()
            expect(a).not.toBe(b)
        })
    })

    describe('calculateModalPosition', () => {
        it('should place modal on the right when there is enough space', () => {
            const result = calculateModalPosition([50, 100], [100, 80])

            // modal size under 16px root font
            expect(result.actualModalWidth).toBeCloseTo((3400 / 960) * 16, 6)
            expect(result.actualModalHeight).toBeCloseTo((1600 / 960) * 16, 6)

            expect(result.left).toBe(150) // clickX + triggerWidth
            expect(result.top).toBeGreaterThanOrEqual(20)
            expect(result.top).toBeLessThanOrEqual(300 - result.actualModalHeight - 20)
        })

        it('should place modal on the left when right side is not available but left side is', () => {
            const result = calculateModalPosition([250, 120], [100, 80])
            const expectedWidth = (3400 / 960) * 16
            const expectedLeft = 250 - expectedWidth - 100

            expect(result.left).toBeCloseTo(expectedLeft, 6)
            expect(result.top).toBeGreaterThanOrEqual(20)
            expect(result.top).toBeLessThanOrEqual(300 - result.actualModalHeight - 20)
        })

        it('should fallback to clamped center position when no direction fits (edge case)', () => {
            setViewport(150, 60)
            const result = calculateModalPosition([10, 10], [100, 80])

            expect(result.left).toBeGreaterThanOrEqual(20)
            expect(result.left).toBeLessThanOrEqual(150 - result.actualModalWidth - 20)
            expect(result.top).toBe(20) // clamp after max/min in very small viewport
        })
    })

    describe('getAdaptiveSize', () => {
        it('should scale each size value by viewport/screenWidth ratio', () => {
            setViewport(960, 300) // ratio = 0.5
            window.webConfig.screenWidth = 1920

            const result = getAdaptiveSize([100, 80, 40])
            expect(result).toEqual([50, 40, 20])
        })

        it('should return empty array for empty input (edge case)', () => {
            const result = getAdaptiveSize([])
            expect(result).toEqual([])
        })

        it('should return Infinity values when screenWidth is 0 (failure behavior)', () => {
            window.webConfig.screenWidth = 0
            const result = getAdaptiveSize([10, 20])
            expect(result[0]).toBe(Infinity)
            expect(result[1]).toBe(Infinity)
        })
    })

    describe('getAdaptiveSizeNumber', () => {
        it('should scale a single number by viewport/screenWidth ratio', () => {
            setViewport(960, 300) // ratio = 0.5
            window.webConfig.screenWidth = 1920

            expect(getAdaptiveSizeNumber(120)).toBe(60)
        })

        it('should return Infinity when screenWidth is 0 (failure behavior)', () => {
            window.webConfig.screenWidth = 0
            expect(getAdaptiveSizeNumber(1)).toBe(Infinity)
        })
    })

    describe('generateSearchParams', () => {
        it('should include only own + truthy properties and support decoding', () => {
            const query = generateSearchParams({
                a: '1',
                b: 2,
                c: '',
                d: 0,
                e: false,
                f: null,
                g: undefined,
                h: 'hello world'
            })

            const params = new URLSearchParams(query)
            expect(params.get('a')).toBe('1')
            expect(params.get('b')).toBe('2')
            expect(params.get('h')).toBe('hello world')

            expect(params.has('c')).toBe(false)
            expect(params.has('d')).toBe(false)
            expect(params.has('e')).toBe(false)
            expect(params.has('f')).toBe(false)
            expect(params.has('g')).toBe(false)
        })

        it('should ignore inherited properties (edge case)', () => {
            const proto = { inherited: 'x' }
            const item = Object.create(proto)
            item.own = 'ok'

            const query = generateSearchParams(item)
            const params = new URLSearchParams(query)

            expect(params.get('own')).toBe('ok')
            expect(params.has('inherited')).toBe(false)
        })

        it('should return empty string for empty object (edge case)', () => {
            expect(generateSearchParams({})).toBe('')
        })

        it('should throw for null/undefined input (failure case)', () => {
            expect(() => generateSearchParams(null as any)).toThrow()
            expect(() => generateSearchParams(undefined as any)).toThrow()
        })
    })
})
