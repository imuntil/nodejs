import * as React from 'react'
import ColumnItem from './column_item'

export default (props: any) => {
  return (
    <div className='_2lx4a-CP_0'>
      <div className='_3KjZQbwk_0'>
        <div className='kcMABq6U_0'>
          <span>课程：</span>
          <a
            className='_2TWCBjxa_0'
            onClick={() => {
              props.filt(0)
            }}
          >
            全部
          </a>
          <a
            className='_2TWCBjxa_0'
            onClick={() => {
              props.filt(1)
            }}
          >
            专栏
          </a>
          <a
            className='_2TWCBjxa_0'
            onClick={() => {
              props.filt(2)
            }}
          >
            视频课程
          </a>
          <a
            className='_2TWCBjxa_0'
            onClick={() => {
              props.filt(3)
            }}
          >
            微课
          </a>
        </div>
      </div>
      <div className='_3hVBef3W_0'>
        <div className='_3S9KmBtG_0'>
          <div className='_1o6EOwiF_0'>
            <div className='_3HUryTHs_0'>
              <a
                className='_1kRLIDSR_0'
                onClick={() => {
                  props.sort(1)
                }}
              >
                上新
              </a>
              <a
                className='_1kRLIDSR_0'
                onClick={() => {
                  props.sort(2)
                }}
              >
                订阅数
              </a>
              <a
                className='_1kRLIDSR_0'
                onClick={() => {
                  props.sort(3)
                }}
              >
                价格
                <span className='_1Yk9PA11_0'>
                  <i className='iconfont _2jewjGCJ_0'></i>{' '}
                  <i className='iconfont _38FM8KCt_0'></i>
                </span>
              </a>
            </div>
            <span className='JfgzzksA_0'>{props.columns.length}个课程</span>
          </div>
          <div>
            {props.columns.map((column: any) => {
              return <ColumnItem column={column} key={column.id} />
            })}
          </div>
          <div className='OjL5wNoM_0'>
            <span>— 没有更多了 —</span>
          </div>
        </div>
      </div>
    </div>
  )
}
