import * as React from 'react'
import { Center, Text, Background, Box, Image } from '@src/components/atoms'
import theme from '@src/constants/theme'
import { CheckIfDesktopContext } from '@src/contexts'
import Swiper from '@src/components/Swiper'
import banner1 from '@src/assets/images/swiper-banner1.png'
import banner2 from '@src/assets/images/swiper-banner2.png'
import banner3 from '@src/assets/images/swiper-banner3.png'
import { Link as InnerLink } from 'gatsby'
import ExternalLink from '@src/components/Link/ExternalLink'

import styled from 'styled-components'

const ImageWrapper = styled(Center)`
  width: 100%;
  height: 100%;
`

const bannerConfigs: {
  img: any
  backgroundColor: string
  alt: string
  link: string
  isExternalLink?: boolean
}[] = [
  {
    img: banner1,
    backgroundColor: '#000',
    alt: 'Serverless Framework',
    isExternalLink: true,
    link: 'https://github.com/serverless/serverless',
  },
  {
    img: banner2,
    backgroundColor: '#dcdcdc',
    alt: 'Serverless Summit-全球项目落地实践研讨会',
    link: '/about',
  },
  {
    img: banner3,
    backgroundColor: '#fff',
    alt: 'Serverless Component',
    link: '/component',
  },
]

export default function() {
  return (
    <CheckIfDesktopContext.Consumer>
      {isDesktopView => {
        return (
          <Box
            pt={
              isDesktopView
                ? theme.headerHeights.desktop
                : theme.headerHeights.mobile
            }
          >
            <Swiper>
              {bannerConfigs.map((config, index) => {
                const Link = config.isExternalLink ? ExternalLink : InnerLink

                return (
                  <Background
                    key={index}
                    className="swiper-slide"
                    width={1}
                    height={['200px', '200px', '200px', '300px']}
                    backgroundRepeat="no-repeat"
                    background={config.backgroundColor}
                  >
                    <Link to={config.link}>
                      <ImageWrapper>
                        <Image
                          width={[0.8, 0.8, 1, '1000px'] as any}
                          height={['auto', 'auto', '200px', '300px'] as any}
                          src={config.img}
                          alt={config.alt}
                        />
                      </ImageWrapper>
                    </Link>
                  </Background>
                )
              })}
            </Swiper>
          </Box>
        )
      }}
    </CheckIfDesktopContext.Consumer>
  )
}
